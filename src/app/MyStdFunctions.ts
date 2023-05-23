
  


    export function convertDate(theDate:Date, theFormat:string) {
        var formattedDate:string="";
        var YY:number= theDate.getFullYear();
        var MM:number = theDate.getMonth()+1;
        var DD:number = theDate.getDate();
        var iYear:number=0;
        var iMonth:number=0;
        var iDay:number=0;
        var MM_String="";
        var DD_String="";

        if (MM<10){
            MM_String="0" + MM.toString();
        }
        else{
            MM_String=MM.toString();
        }
        if (DD<10){
            DD_String="0" + DD.toString();
        }
        else{
           DD_String=DD.toString();
        }


        iYear=theFormat.indexOf("y")+1;
        if (iYear===0) {iYear=theFormat.indexOf("Y")+1};
        if (iYear===0) {formattedDate= ""} 
        else{
            iMonth=theFormat.indexOf("m")+1;
            if (iMonth===0) {iYear=theFormat.indexOf("M")+1};
            if (iMonth===0) {formattedDate= ""} 
            else{
                iDay=theFormat.indexOf("d")+1;
                if (iDay===0) {iYear=theFormat.indexOf("D")+1};
                if (iDay===0) {formattedDate= ""} 
                else{
                    if (iYear===1) { //format is YYYY-MM-DD
                        formattedDate = YY + theFormat.substring(iYear+4,iYear+3)+ MM_String + theFormat.substring(iMonth+2,iMonth+1)+DD_String;
                    }
                    else{ //format is DD-MM-YYYY
                        formattedDate = DD_String + theFormat.substring(iDay+2,iDay+1)+ MM_String + theFormat.substring(iMonth+2,iMonth+1)+YY
                    }
                }
            }
        }
            
          return(formattedDate);
    }

 
    