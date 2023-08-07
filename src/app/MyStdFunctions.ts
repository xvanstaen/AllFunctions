

    export function convertDate(theDate:Date, theFormat:string) {
        var formattedDate:string=theFormat;
        var YY:number= theDate.getFullYear();
        var MM:number = theDate.getMonth()+1;
        var DD:number = theDate.getDate();
        var iYear:number=0;
        var iMonth:number=0;
        var iDay:number=0;
        var MM_String="";
        var DD_String="";
        
        const sep1Pos0=theFormat.indexOf('/');
        const sep2Pos0=theFormat.indexOf('-');
        const sep1Pos1=theFormat.substring(sep1Pos0+1).indexOf('/');
        const sep2Pos1=theFormat.substring(sep2Pos0+1).indexOf('-');

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
            if (iMonth===0) {iMonth=theFormat.indexOf("M")+1};
            if (iMonth===0) {formattedDate= ""} 
            else{
                iDay=theFormat.indexOf("d")+1;
                if (iDay===0) {iDay=theFormat.indexOf("D")+1};
                if (iDay===0) {formattedDate= ""} 
                else{
                    formattedDate=formattedDate.replace(formattedDate.substring(iYear-1,iYear+3),YY.toString());
                    formattedDate=formattedDate.replace(formattedDate.substring(iMonth-1,iMonth+1),MM_String);
                    formattedDate=formattedDate.replace(formattedDate.substring(iDay-1,iDay+1),DD_String);
                    /*if (iYear===1) { //format is YYYY-MM-DD

                        formattedDate = YY + theFormat.substring(iYear+4,iYear+3)+ MM_String + theFormat.substring(iMonth+2,iMonth+1)+DD_String;
                    }
                    else{ //format is DD-MM-YYYY
                        formattedDate = DD_String + theFormat.substring(iDay+2,iDay+1)+ MM_String + theFormat.substring(iMonth+2,iMonth+1)+YY
                    }*/
                }
            }
        }    
        return(formattedDate);
    }


    export function fnAddTime(theDate:string, addHour:number, addMin:number){
        // format of theDate is YYYMMDDHHMNSS
        var stringHour='';
        var stringMin='';
        var plusDay=0;
        var plusHour=0;
        var theDateHour=Number(theDate.substring(8,10)) + Number(addHour);
        var theDateMin=Number(theDate.substring(10,12)) + Number(addMin);
        
        if (Math.trunc(theDateMin / 60) > 0){
          plusHour =  Math.trunc(theDateMin / 60);
          theDateMin= theDateMin % 60;
        }
        if (theDateMin<10){
            stringMin ='0'+ theDateMin.toString();
        } else { 
            stringMin = theDateMin.toString();
        }
        theDateHour=theDateHour+plusHour;
        if (Math.trunc(theDateHour / 24) > 0){
          plusDay =  Math.trunc(theDateHour / 24);
          theDateHour= theDateHour % 24;
        }
        if (theDateHour<10){
            stringHour ='0'+ theDateHour.toString();
        } else { 
            stringHour = theDateHour.toString();
        }
        var theDay=Number(theDate.substring(6,8));
        var theMonth=Number(theDate.substring(4,6));
        var theYear=Number(theDate.substring(0,4));
        const tabDays=[31,28,31,30,31,30,31,31,30,31,30,31];
        if (plusDay>0){
            theDay=theDay+plusDay;
            if (theDay>tabDays[theMonth-1]){
                theDay=theDay-tabDays[theMonth-1];
                theMonth++
                if (theMonth>12){
                    theMonth=theMonth-12;
                    theYear=theYear+1;
                }
            }
        }
        var stringMonth="";
        var stringDay="";
        if (theMonth<10){
            stringMonth="0" + theMonth;
        } else {
            stringMonth=theMonth.toString();;
        }
        if (theDay<10){
            stringDay="0" + theDay;
        } else {
            stringDay=theDay.toString();;
        }

        return(theYear.toString()+stringMonth+stringDay+stringHour+stringMin+theDate.substring(12,14));
    
      }

      export function strDateTime(){
        const aDate=new Date();
        const theDate=aDate.toUTCString();

        const stringDate=convertDate(aDate,'YYYYMMDD');
        return(stringDate + theDate.substring(17,19)+theDate.substring(20,22)+theDate.substring(23,25));
      }


      export function fnCheckLockLimit(configServer:any,tabLock:any,iWait:any, lastInputAt:string, isRecordModified:boolean, isSaveFile:boolean){ 
        var returnValue={
            action:"noAction",
            lockValue:0,
            lockAction:''
        }
    
        if (tabLock[iWait].lock!==3){

            const currentTime=strDateTime();
    
            const timeOutValue=fnAddTime(tabLock[iWait].updatedAt,configServer.timeoutFileSystem.hh,configServer.timeoutFileSystem.mn);
            const bufferTimeOutValue=fnAddTime(tabLock[iWait].updatedAt,configServer.timeoutFileSystem.bufferTO.hh,configServer.timeoutFileSystem.bufferTO.mn);
            const bufferLastInput=fnAddTime(tabLock[iWait].updatedAt,configServer.timeoutFileSystem.bufferInput.hh,configServer.timeoutFileSystem.bufferInput.mn);
            
           // if (tabLock[iWait].lock===2){
           //   isAllDataModified = false;
           // }
           
            //console.log('===> checkLockLimit():  timeOutValue= ' + timeOutValue, '  currentTime= ' + currentTime + '  bufferLastInput=' + bufferLastInput );
            
            if (Number(currentTime) <= Number(timeOutValue) && Number(lastInputAt) >=Number(bufferTimeOutValue) 
                                    && tabLock[iWait].lock === 1 && isRecordModified === true){
              // isMustSaveFile=true;
              // theEvent.target.id='All'; 
              // ConfirmSave(theEvent);
              if (isSaveFile===true){
                //ProcessSaveHealth(theEvent);
                returnValue.action="ProcessSaveHealth";
              } else {
                returnValue.action="ConfirmSave";
              }
              
    
            } else if (Number(currentTime) <= Number(timeOutValue) && Number(lastInputAt) >= Number(bufferLastInput)
                                    && tabLock[iWait].lock === 1 && isRecordModified === true){
              //updateLockFile(iWait);
              returnValue.action="updateSystemFile";
              returnValue.lockAction="updateLockFile";

            } else  if (Number(currentTime) > Number(timeOutValue) ){ // timeout is reached
                
                if (tabLock[iWait].lock === 1 && isRecordModified === true){
                    //checkFile(iWait); // check if it is possible to still trigger the changes 
                    returnValue.action="checkFile";
                    
                } else if (tabLock[iWait].lock === 1){
                    //tabLock[iWait].lock = 0; // user has not done anything until timeout;  
                    returnValue.action="changeTabLock";
                } else if (tabLock[iWait].lock===0 && isRecordModified === true) {
                    //lockFile(iWait); // user is trying to do something but file was not locked
                    returnValue.action="updateSystemFile";
                    returnValue.lockAction="lockFile";
                } else if (tabLock[iWait].lock===2) {
                    //lockFile(iWait); // check if file can now be locked by this user - may have been unlocked in the meantime by other user
                    returnValue.action="updateSystemFile";
                    returnValue.lockAction="lockFile";
                } 
            } else  if (isSaveFile===true){
                //ProcessSaveHealth(theEvent);
                returnValue.action="ProcessSaveHealth";
            } 
          
        
    }
 
    return(returnValue);
}