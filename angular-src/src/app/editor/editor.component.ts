import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FlawService } from '../services/flaw.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  constructor(private route: ActivatedRoute, private flawService: FlawService) { }
  qCode; userId;
  usedBefore: boolean = false;
  preCodes = ["#include <stdio.h>\r\nint main()\r\n{\r\n\tprintf(\"Hello World !!!\");\r\n\treturn 0;\r\n}",
  "#include <iostream>\r\nusing namespace std;\r\nint main()\r\n{\r\n\tcout << \"Hello World !!!\";\r\n\treturn 0;\r\n}",
  "public class solution\r\n{\r\n\tpublic static void main(String[] args)\r\n\t{\r\n\t\tSystem.out.println(\"Hello World !!!\");\r\n\t}\r\n}",
  "print(\"Hello World !!!\")"];
  code: string;  lang: string;  result = {code : 1}; resultMsg: string = "Correct Answer";
  bootstrapclass: string = 'success';
  codeForm: FormGroup;
  text="Avnish";  editTheme: string;  editMode: string;

  ngOnInit() {
    this.editTheme = 'eclipse';
    this.editMode = 'c_cpp';
    this.code = this.preCodes[0];
    this.qCode = this.route.snapshot.paramMap.get('qCode');
    this.userId = JSON.parse(localStorage.getItem('user')).name;
    this.codeForm = new FormGroup({
      'qCode': new FormControl(null),
      'code': new FormControl(null),
      'theme': new FormControl(null)
    });
  }

  submit() {
    if(this.lang == 'C')
        this.lang = 'c';
    if(this.lang == 'CPP')
        this.lang = 'cpp';
    if(this.lang == 'JAVA')
        this.lang = 'java';
    if(this.lang == 'PYTHON')
        this.lang = 'PY';
    this.flawService.execute({code: this.code, lang: this.lang, qCode: this.qCode}).subscribe(
      data => { console.log('Success', data);
      this.result = data;
      this.assignClass();
       },
      error => console.log('Error', error),
    );
    // console.log(this.codeForm.value.code);
    // this._enrollment.evaluate({c: this.code, l: this.lang}).subscribe(
    //   data => { console.log('Success', data);
    //   this.result = data;
    //   this.assignClass();
    //    },
    //   error => console.log('Error', error),
    // );
  }

  setTheme() {
    this.editTheme = this.codeForm.value.theme;
  }
  
  setMode() {
    if(this.codeForm.value.qCode == 'c') {
      if(!this.usedBefore)
        this.code = this.preCodes[0];
      this.editMode = 'c_cpp';
      return;
    }
    if(this.codeForm.value.qCode == 'cpp') {
      if(!this.usedBefore)
        this.code = this.preCodes[1];
      this.editMode = 'c_cpp';
      return;
    }
    if(this.codeForm.value.qCode == 'java') {
      if(!this.usedBefore)
        this.code = this.preCodes[2];
      this.editMode = 'java';
      return;
    }
    if(this.codeForm.value.qCode == 'python') {
      if(!this.usedBefore)
        this.code = this.preCodes[3];
      this.editMode = 'python';
      return;
    }
  }

  assignClass() {
    if(this.result.code == 1) {
      this.bootstrapclass = 'success';
      this.resultMsg = 'Correct Answer';
    }
    if(this.result.code == 0) {
      this.bootstrapclass = 'danger';
      this.resultMsg = 'Wrong Answer';
    }
    if(this.result.code == 2) {
      this.bootstrapclass = 'warning';
      //let errorString = this.result.res.stderr.replace(/C:\\Users\\user\\Desktop\\submitfile/gi,'solution');
      this.resultMsg = 'Compile Time Error:'//+errorString;
    }
    if(this.result.code == 3) {
      this.bootstrapclass = 'danger';
      this.resultMsg = 'Run Time Error';
    }
    if(this.result.code == 4) {
      this.bootstrapclass = 'warning';
      this.resultMsg = 'Time Limit Exceeded';
    }
  }

}
