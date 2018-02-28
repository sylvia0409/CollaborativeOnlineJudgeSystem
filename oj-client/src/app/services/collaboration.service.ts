import { Injectable } from '@angular/core';
import { COLORS } from '../../assets/color';

declare var io : any;
declare var ace : any;

@Injectable()
export class CollaborationService {
  collaborationSocket: any;
  userInfo: Object = [];
  userNum: number = 0;
  constructor() { }

  init(editor: any, sessionID: string){
    this.collaborationSocket = io(window.location.origin, {query: 'session='+sessionID});
    this.collaborationSocket.on('change',(delta: string) => {
      console.log('editor changed by '+ delta);
      delta = JSON.parse(delta);
      editor.lastAppliedChange = delta;
      editor.session.getDocument().applyDeltas([delta]);
    })
    
    this.collaborationSocket.on('cursorMove', (cursor) => {
      cursor = JSON.parse(cursor);
      let x = cursor['row'];
      let y = cursor['column'];
      let changedUser = cursor['socketID'];
      let session = editor.session;
      if(changedUser in this.userInfo){
        session.removeMarker(this.userInfo[changedUser]['marker']);
      } else {
        //give new cursor a color
        this.userInfo[changedUser] = {}; 
        let css = document.createElement('style');
        css.type = 'text/css';
        css.innerHTML = '.editor_cursor_' + changedUser +
          '{ position: absolute; background: ' + COLORS[this.userNum] + ';' +
          'z-index: 100; width: 3px; !important;}';
          document.appendChild(css);
          this.userNum++;
      }
      //draw a new cursor
      let Range = ace.require('ace/range').Range;
      let newMarker = session.addMarker(new Range(x,y,x,y+1),
                                        'editor_cursor_'+ changedUser,
                                        true);
      this.userInfo[changedUser]['marker'] = newMarker;
    })
  }

  change(delta: string){
    this.collaborationSocket.emit('change', delta);
  }

  cursorMove(cursor: string){
    this.collaborationSocket.emit('cursorMove', cursor);
  }

  restoreBuffer(){
    this.collaborationSocket.emit('restoreBuffer');
  }
}
