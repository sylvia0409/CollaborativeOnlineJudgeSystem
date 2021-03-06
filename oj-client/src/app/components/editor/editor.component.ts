import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

declare var ace : any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  editor : any;
  language: string = 'Java';
  languages: string[] = ['Java', 'C++', 'Python', 'JavaScript'];
  sessionId: string;
  output: string;
  defaultContent = {
    'Java': `public class Example {
public static void main(String[] args) { 
    // Type your Java code here 
    } 
}`,
    'C++': `#include <iostream> 
using namespace std; 
int main() { 
  // Type your C++ code here 
  return 0; 
}`, 
    'Python': `class Solution: 
   def example(): 
       # Write your Python code here`,
    'JavaScript': `function foo(items) {
        // Type your code here
      }`
}
  constructor(@Inject('collaboration') private collaboration,
              @Inject('dataService') private dataService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.sessionId = params['id'];
      this.initEditor();
    });
  }

  initEditor(){
    this.editor = ace.edit("editor");
    this.editor.setTheme("ace/theme/xcode");
    this.editor.setFontSize(18); 
    
    this.resetEditor();
    this.collaboration.init(this.editor, this.sessionId);
    this.editor.lastAppliedChange = null;
    this.editor.on('change', (e) => {
      console.log('editor changed' + JSON.stringify(e));
      if(this.editor.lastAppliedChange != e){
        this.collaboration.change(JSON.stringify(e));
      }
    })
    this.editor.session.getSelection().on('cursor', () => {
      let cursor = this.editor.session.getSelection().getCursor();
      this.collaboration.cursorMove(JSON.stringify(cursor));
    })
    //show contents written by previous participants
    this.collaboration.restoreBuffer();
  }

  setLanguage(language: string) {
    this.language = language;
    this.resetEditor();
  }

  resetEditor(): void {
    console.log('Resetting editor');
    if(this.language == 'C++'){
      this.editor.session.setMode(`ace/mode/c_cpp`);
    }
    this.editor.session.setMode(`ace/mode/${this.language.toLowerCase()}`);
    this.editor.setValue(this.defaultContent[this.language]);
    this.output = '';
  }

  submit(){
    this.output = '';
    const userCode = this.editor.getValue();
    const data = {
      userCode: userCode,
      language: this.language.toLocaleLowerCase()
    };
    this.dataService.buildAndRun(data)
      .then(result => this.output = result.text);

  }
}
