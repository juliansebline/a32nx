// Copyright (c) 2021-2022 FlyByWire Simulations
// Copyright (c) 2021-2022 Synaptic Simulations
//
// SPDX-License-Identifier: GPL-3.0

import fetch from 'node-fetch';

import { FlightPlan } from '@fmgc/flightplanning/new/plans/FlightPlan';
import { loadSingleWaypoint } from '@fmgc/flightplanning/new/segments/enroute/WaypointLoading';
import { FlightPlanLeg } from '@fmgc/flightplanning/new/legs/FlightPlanLeg';
import { assertNotDiscontinuity } from '@fmgc/flightplanning/new/test/LegUtils';

if (!globalThis.fetch) {
    globalThis.fetch = fetch;
}

describe('a base flight plan', () => {
    it('can insert a leg', async () => {
        const fp = FlightPlan.empty();

        await fp.setOriginAirport('CYUL');
        await fp.setOriginRunway('RW06R');
        await fp.setDeparture('CYUL1');

        await fp.setDestinationAirport('CYYZ');
        await fp.setDestinationRunway('RW05');
        await fp.setApproach('I05');
        await fp.setArrival('BOXUM5');

        const waypoint = await loadSingleWaypoint('NOSUS', 'WCYCYULNOSUS');

        const leg = FlightPlanLeg.fromEnrouteWaypoint(fp.enrouteSegment, waypoint);

        fp.insertElementAfter(3, leg, true);

        const fpLeg = assertNotDiscontinuity(fp.allLegs[4]);

        expect(fpLeg.ident).toEqual('NOSUS');
        expect(fp.allLegs[5].isDiscontinuity).toBeTruthy();

        expect(fp.allLegs).toHaveLength(24);
    });

    it('will collapse duplicate waypoints after inserting a leg', async () => {
        const fp = FlightPlan.empty();

        await fp.setOriginAirport('CYUL');
        await fp.setOriginRunway('RW06R');
        await fp.setDeparture('CYUL1');

        await fp.setDestinationAirport('CYYZ');
        await fp.setDestinationRunway('RW05');
        await fp.setApproach('I05');
        await fp.setArrival('BOXUM5');

        const waypoint = await loadSingleWaypoint('ERBUS', 'WCYCYYZERBUS');

        const leg = FlightPlanLeg.fromEnrouteWaypoint(fp.enrouteSegment, waypoint);

        fp.insertElementAfter(3, leg, false);

        const fpLeg4 = assertNotDiscontinuity(fp.allLegs[4]);

        expect(fpLeg4.ident).toEqual('ERBUS');

        const fpLeg5 = assertNotDiscontinuity(fp.allLegs[5]);

        expect(fpLeg5.ident).toEqual('SELAP');

        expect(fp.allLegs).toHaveLength(19);
    });
});
