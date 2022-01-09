// Copyright (c) 2021-2022 FlyByWire Simulations
// Copyright (c) 2021-2022 Synaptic Simulations
//
// SPDX-License-Identifier: GPL-3.0

import { Location, Runway, Waypoint, WaypointArea } from 'msfs-navdata';
import { placeBearingDistance } from 'msfs-geo';
import { fixCoordinates } from '@fmgc/flightplanning/new/utils';

export namespace WaypointFactory {

    export function fromWaypointLocationAndDistanceBearing(
        ident: string,
        location: Location,
        distance: NauticalMiles,
        bearing: DegreesTrue,
    ): Waypoint {
        const loc = placeBearingDistance(fixCoordinates(location), bearing, distance);

        const point: Location = { lat: loc.lat, lon: loc.long };

        return {
            databaseId: 'X      CF   ',
            icaoCode: '  ',
            area: WaypointArea.Enroute,
            ident,
            location: point,
        };
    }

    export function fromRunway(runway: Runway): Waypoint {
        return {
            ...runway,
            location: runway.thresholdLocation,
            area: WaypointArea.Terminal,
        };
    }

}
