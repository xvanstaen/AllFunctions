    import {TravelDates} from './apt_code_name'
    export function CreateArray2D(x:number,y:number) {
        var region_array=Array(x);
        var i: number=0;
        for ( i=0; i<y; i++) {
           region_array[i] = Array(y);
        }

        region_array[0][0] = "Republic of Korea";
        region_array[0][1] = "SEL Seoul/All airports";
        region_array[0][2] = "ICN Seoul/Incheon";
        region_array[0][3] = "GMP Seoul/Gimpo";
        region_array[0][4] = "PUS Busan/Gimhae";
        region_array[0][5] = "CJU Jeju";
        region_array[0][6] = "CJJ Cheongju";
        region_array[0][7] = "TAE Daegu";
        region_array[0][8] = "KWJ Gwangju";
        region_array[0][9] = "USL Uslan";

        region_array[1][0]  = "NorthEast Asia";
        region_array[1][1]  = "AOJ Aomori";
        region_array[1][2]  = "PEK Beijing/Shoudu";
        region_array[1][3]  = "HKG HongKong";

        region_array[2][0]  = "Europe";
        region_array[2][1]  = "FRA Frankfurt";
        region_array[2][2]  = "CDG Paris/Charles de Gaulle";
        region_array[2][3]  = "LHR London/Heathrow";

        region_array[3][0]  = "Southeast/Southwest Asia";
        region_array[3][1]  = "BKK Bangkok";
        region_array[3][2]  = "BWN Brunei";
        region_array[3][3]  = "CEB Cebu";
        region_array[3][4]  = "DEL Delhi";
        region_array[3][5]  = "KUL Kuala Lumpur";
        region_array[3][6]  = "HKT Phuket";
        region_array[3][7]  = "SIN Singapore/Changi";
        region_array[3][8]  = "RGN Yangon";

        return(region_array);
    }
