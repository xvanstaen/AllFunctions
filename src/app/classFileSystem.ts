// content of file system
export class classFileSystem{
    bucket:string="";
    object:string="";
    byUser:string="";
    lock:boolean=false;
    from:string="";
    to:string=""; // may not be needed
}

export class classUpdate{
    byUser:string="";
    from:string="";
    to:string=""; // may not be needed
}

// input data to componenet check-file-update
export class classAccessFile{
    action:string=""; // 'lock' or 'unlock'
    bucket:string=''; 
    object:string='';
    user:string="";
    iWait:number=0;
  }
export class classReturnCheckFileUpdate{
    error:number=0; 
    lock:boolean=false;
    action:string=""; // 'lock' or 'unlock'
    bucket:string=''; 
    object:string='';
    iWait:number=0;
    user:string="";

  }
