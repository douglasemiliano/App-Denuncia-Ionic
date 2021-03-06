import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  form: FormGroup;
  private apiURL: string;

  constructor(private fb: FormBuilder,private http: HttpClient, public toastController: ToastController, private route: Router) { 
    this.apiURL = 'http://localhost:8080/denuncias'
  }

  ngOnInit() {
    this.createForm();
  }

  createForm(){ this.form = this.fb.group({
    name: new FormControl('', [Validators.required]),
    age: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(3)]),
    phone: new FormControl(''),
    assediotype: new FormControl('', [Validators.required]),
    local: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    incontact: new FormControl('', [Validators.required]),
  });
}
onSubmit() {
  this.createDenuncia(this.form.value);
  this.resetForm(this.form);
  this.route.navigate(['/tabs/tab2']);
  }

  public createDenuncia(denuncia){
    this.http.post(this.apiURL, denuncia)
    .subscribe(
      resultado => {
        this.presentToastSucess();
      },
      erro => {
        if(erro.status == 500) {
          this.presentToast();
        }
      }
    );
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Sua denuncia não pode ser finalizada, revise as informações e tente novamente.',
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }

  async presentToastSucess() {
    const toast = await this.toastController.create({
      message: 'Moça, sua denuncia foi realizada com sucesso. Não se preocupe, tudo vai dar certo!',
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

  resetForm(form: FormGroup) {
    form.reset();
    Object.keys(form.controls).forEach(key => {
      form.get(key).setErrors(null) ;
    });
}

}