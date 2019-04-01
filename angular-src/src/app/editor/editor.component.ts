import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }
  qCode;
  code: string;
  languages = ['C','CPP','JAVA','PYTHON'];
  lang: string;
  result: any;
  bootstrapclass: string = 'info';
  codeForm: FormGroup;
  text="Avnish";

  ngOnInit() {
    this.qCode = this.route.snapshot.paramMap.get('qCode');
    this.codeForm = new FormGroup({
      'qCode': new FormControl(null, [Validators.required]),
      'code': new FormControl(null, [Validators.required]),
      // 'desc': new FormControl(null, [Validators.required])
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
    console.log(this.codeForm.value.code);
    // this._enrollment.evaluate({c: this.code, l: this.lang}).subscribe(
    //   data => { console.log('Success', data);
    //   this.result = data;
    //   this.assignClass();
    //    },
    //   error => console.log('Error', error),
    // );
  }

  assignClass() {
    if(this.result.code == 1) {
      this.bootstrapclass = 'success';
      this.result = 'Correct Answer';
    }
    if(this.result.code == 0) {
      this.bootstrapclass = 'danger';
      this.result = 'Wrong Answer';
    }
    if(this.result.code == 2) {
      this.bootstrapclass = 'warning';
      let errorString = this.result.res.stderr.replace(/C:\\Users\\user\\Desktop\\submitfile/gi,'solution');
      this.result = 'Compile Time Error:\r\n'+errorString;
    }
    if(this.result.code == 3) {
      this.bootstrapclass = 'danger';
      this.result = 'Run Time Error';
    }
    if(this.result.code == 4) {
      this.bootstrapclass = 'warning';
      this.result = 'Time Limit Exceeded';
    }
  }

}
