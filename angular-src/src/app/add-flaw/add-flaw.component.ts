import { Component, OnInit ,ElementRef, ViewChild} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FlawService } from '../services/flaw.service';

@Component({
  selector: 'app-add-flaw',
  templateUrl: './add-flaw.component.html',
  styleUrls: ['./add-flaw.component.css']
})
export class AddFlawComponent implements OnInit {

  constructor(private flawService: FlawService,
    private router: Router/*,
    private notificationsService: NotificationsService*/) { }

  addFlawForm: FormGroup;
  fileSelected: File;
  flaw: {};
  ipFile={
    'name':"",
    'value':""
  };
  opFile={
    'name':"",
    'value':""
  };
  @ViewChild('inputFile') inputFile: ElementRef;
  @ViewChild('outputFile') outputFile: ElementRef;

  ngOnInit() {
    this.addFlawForm = new FormGroup({
      'qCode': new FormControl(null, [Validators.required, Validators.minLength(5)]),
      'qName': new FormControl(null, [Validators.required]),
      'desc': new FormControl(null, [Validators.required]),
      'ipFormat': new FormControl(null, [Validators.required]),
      'opFormat': new FormControl(null, [Validators.required]),
      'constraint': new FormControl(null, [Validators.required]),
      'testcase': new FormControl(null, [Validators.required]),
      'explain': new FormControl(null, [Validators.required]),
      'points': new FormControl(null, [Validators.required]),
      'ipFile': new FormControl(null, [Validators.required]),
      'opFile': new FormControl(null, [Validators.required]),
      'timeLimit': new FormControl(null, [Validators.required]),
      'sourceLimit': new FormControl(null, [Validators.required]),
      'author': new FormControl(null, [Validators.required])
    });
  }
  onInputFile(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.ipFile.name=file.name;
        this.ipFile.value=reader.result.split(',')[1];
      };
    }
  }

  onOutputFile(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.opFile.name=file.name;
        this.opFile.value=reader.result.split(',')[1];
      };
    }
  }

  addFlaw(navigate: boolean){
    console.log(this.ipFile.value);
    this.flaw = {
      qCode: this.addFlawForm.value.qCode,
      qName: this.addFlawForm.value.qName,
      desc: this.addFlawForm.value.desc,
      ipFormat: this.addFlawForm.value.ipFormat,
      opFormat: this.addFlawForm.value.opFormat,
      constraint: this.addFlawForm.value.constraint,
      testcase: this.addFlawForm.value.testcase,
      explain: this.addFlawForm.value.explain,
      points: this.addFlawForm.value.points,
      ipFile: this.ipFile,
      opFile: this.opFile,
      timeLimit: this.addFlawForm.value.timeLimit,
      sourceLimit: this.addFlawForm.value.sourceLimit,
      author: this.addFlawForm.value.author
    }
    this.flawService.addflaw(this.flaw).subscribe(
      data => {
        this.addFlawForm.reset();
       // this.notificationsService.success("Success", data.msg, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
        if(navigate)
          this.router.navigate(['/flaw']);
      },
      error => {
       // this.notificationsService.error("Oops!!", JSON.parse(error._body).error, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      }
    );
  }

}
