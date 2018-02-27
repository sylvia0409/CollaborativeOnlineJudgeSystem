import { Injectable } from '@angular/core';

declare var io : any;

@Injectable()
export class CollaborationService {
  collaborationSocket: any;
  constructor() { }

  init(editor: any, sessionID: string){
    this.collaborationSocket = io(window.location.origin, {query: 'session='+sessionID});
    this.collaborationSocket.on('change',(delta: string) => {
      console.log('editor changed by '+ delta);
      delta = JSON.parse(delta);
      editor.lastAppliedChange = delta;
      editor.session.getDocument().applyDeltas([delta]);
    })
  }

  change(delta: string){
    this.collaborationSocket.emit('change', delta);
  }
}
