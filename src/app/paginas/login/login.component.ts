import { Component, OnInit } from '@angular/core';
import { ServiceService } from "../../servicios/service.service";
import { FormBuilder, Validators,FormGroup, FormControl } from '@angular/forms';
import{ GlobalConstants } from '../../../common/global-constants';
declare var jQuery: any;
import{Router} from '@angular/router';

export interface EmployeeProd  {
  codigo:string;
  nomcorto:string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  formGroup: FormGroup;
  myControl = new FormControl();
  animalControl = new FormControl('', Validators.required);
  productores:Productor[] = [{nombre: '',codigo:''},{nombre: 'Chaparral',codigo:'01'},{nombre: 'Tombell',codigo:'02'}];

  constructor(private servicesService: ServiceService,formBuilder: FormBuilder,private router:Router) { 
      this.formGroup = formBuilder.group({
      productor:['',Validators.required],
      usuario: ['',Validators.required],
      contraseña:['',Validators.required]
    });
  }

  ngOnInit(): void { 
// var i;
//     (function ($) {
//       for(i=5;i<=11;i++)
//       {
//         var total=0;
//         $('table#tblKardexValorizado tbody td:nth-child(' + i + ')').each(function (index) 
//         {
//           total += parseFloat($(this).text());  
//         });
//         $('table#tblKardexValorizado tfoot th:nth-child(' + i + ')').text("Total: " + total)  
//       }
//     })(jQuery);


    
  }

  onFormSubmit() {   
    this.ValidarUsuario();
   }
  //VARIABLES
   resultadoLogIn=null;
   existeUsuario:boolean=false;
   nombreUsuario:'';
   resultado=null;
   mostrarNavBar = false;

  datoscaptura={
    productor:'',
    usuario:'',
    contrasena:''
  }

  jLogIn ={
    productor:null,
    usuario:null,
    contrasena:null
  }

  ValidarUsuario(){
    if(this.animalControl.value['codigo']=='01'){
      GlobalConstants.apiURL="http://192.168.10.201/apiventas/"
            
    }else{
      GlobalConstants.apiURL="http://192.168.11.200/apiventas/"
    }
    console.log(GlobalConstants.apiURL);
    
    //console.log(GlobalConstants.apiURL);
    var a = this.animalControl.value;
    //console.log(this.productores);
       if(this.animalControl.value['nombre']=="" || this.animalControl.value==''){
            return
    }
        
    this.jLogIn.productor=this.datoscaptura.productor.substring(0,2);
    this.jLogIn.usuario = this.datoscaptura.usuario;
    this.jLogIn.contrasena=this.datoscaptura.contrasena;
    this.servicesService.validarLogIn(this.jLogIn).subscribe(result=>this.resultadoLogIn=result);    
    setTimeout(() => {
      console.log(this.resultadoLogIn);
      if(this.resultadoLogIn==0){
        alert("Usuario y Contraeña no Existe.");
      }else{
        this.existeUsuario=true;
        this.nombreUsuario=this.resultadoLogIn[0]["nombre"];
        this.router.navigate(['inicio'])
      }
    }, 500);

  }
}

interface Productor {
  nombre: string;
  codigo: string;
}
