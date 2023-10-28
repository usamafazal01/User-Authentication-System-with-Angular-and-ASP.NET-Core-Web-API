import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import validateForm from 'src/app/helpers/validateForm';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  
  type: string= "Password"
  isText: boolean= false;
  eyeIcon: string= "fa-eye-slash";
  SignUpForm! : FormGroup; 
  constructor (private fb: FormBuilder, private auth: AuthService, private router: Router)
  {

  }
  

  ngOnInit() : void{

  
  this.SignUpForm = this.fb.group(
    {
      Username : ['', Validators.required  ],
      Password: ['', Validators.required],
      LastName: ['', Validators.required],
      FirstName: ['', Validators.required],
      Email: ['', Validators.required]
    }
  )
  }

  hideShowPass(){
    this.isText = !this.isText; 
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type= "text" : this.type = "Password";
   }
 

  onRegister(){

    if(this.SignUpForm.valid){

      console.log(this.SignUpForm.value);
     // alert("Form is valid");

      // Perform Logic for Registeration

      this.auth.signUp(this.SignUpForm.value)
      .subscribe({
        next: (res=>{
          alert(res.message);
          this.SignUpForm.reset();
          this.router.navigate(['login']);

}),

     error: (err=> {
      alert(err?.error.message);
     }
      
      )

      })

    }else{
      //throw the error using toaster with required field

      validateForm.validateAllFormFields(this.SignUpForm);
      alert("Form is invalid");

    }



   

  }


  


}
