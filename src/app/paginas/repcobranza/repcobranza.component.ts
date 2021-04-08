import { Component, OnInit } from '@angular/core';
import { ServiceService } from "../../servicios/service.service";
import { FormGroup, FormControl } from '@angular/forms';
import {observable, Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
declare var jQuery: any;
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-repcobranza',
  templateUrl: './repcobranza.component.html',
  styleUrls: ['./repcobranza.component.css']
})
export class RepcobranzaComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private servicesService: ServiceService,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.metodoProductor();
    this.metodoCliente();
  }

  datoscaptura={
    productor:'',
    cliente:'',
    fechaini:'',
    fechafin:''
  }
  // COMBO PRODUCTOR
  buscaSelect ={
    cCampos:null, cFrom:null, cWhere:null
  }
  cachaProductor={
    codigo:null,nomcorto:null
  }  
  productorCtrl = new FormControl();
  filteredEmployeeProd: Observable<EmployeeProd[]>;
  employeesProd: EmployeeProd[] = [];
  resultadoProductor=null; 

  private _filterEmployeesprod(value: string): EmployeeProd[] {
    const filterValue = value.toLowerCase();

    return this.employeesProd.filter(state => state.nomcorto.toLowerCase().indexOf(filterValue) === 0);
  }   
  metodoProductor(){
    this.buscaSelect.cCampos="codigo,TRIM(nomcorto) AS nomcorto";
    this.buscaSelect.cFrom= "productor";
    this.buscaSelect.cWhere="";
    this.servicesService.selectQuery(this.buscaSelect).then((result)=>{
    this.resultadoProductor=result
    this.employeesProd=this.resultadoProductor;
    this.filteredEmployeeProd = this.productorCtrl.valueChanges
      .pipe(
        startWith(''),
        map(productor => productor ? this._filterEmployeesprod(productor) : this.employeesProd.slice())
      );
    });
   }
  
   //COMBO CLIENTE
   buscaCliente ={
    cCampos:null,cFrom:null, cWhere:null
  }
  cachaCliente={
    codigo:null,nombre:null
  }
   seleccionaCliente:string[];
   nCodigoCliente = "";
   resultadoCliente =  null;
   formGroup: FormGroup;
   employeeCtrl = new FormControl();
   filteredEmployee: Observable<interfazCliente[]>;
   employees: interfazCliente[] = [];
   private _filterEmployees(value: string): interfazCliente[] {
    const filterValue = value.toLowerCase();

    return this.employees.filter(state => state.nombre.toLowerCase().indexOf(filterValue) === 0);
  }

   metodoCliente(){
    this.buscaCliente.cCampos="codigo,TRIM(nombre) AS nombre";
    this.buscaCliente.cFrom=" manifiestos man inner join clientes cli on cli.codigo = man.cliente";
    this.buscaCliente.cWhere=" where Man.tipo = 'N' and Man.Cancelado = 0 group by codigo,nombre ";
    this.servicesService.selectQuery(this.buscaCliente).then((result)=>{
    this.resultadoCliente=result
    this.employees=this.resultadoCliente;
      this.filteredEmployee = this.employeeCtrl.valueChanges
      .pipe(
        startWith(''),
        map(employee => employee ? this._filterEmployees(employee) : this.employees.slice())
      );
    });
   }
   //Termina Combo Cliente

   validarVacios(){  
    var fechainicial="";
    var fechafinal="";
  
    (function ($) {
      fechainicial= $("#txtfechaini").val();
      fechafinal= $("#txtfechafin").val();
    })(jQuery);

    //validar parametros obligatorios 
    if (fechainicial =="" || fechafinal == "") {
      this.messageBox("Hay campos Vacios....!!!! ");
      return;
      
     }
    }
    messageBox(pMensaje){
      this._snackBar.open(pMensaje, 'Verifica !!!', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
   
   //GENERAR COBRANZA
    llamarProcedimiento = {procedure:null,param:null};
    resultadoRepCobranzaCH=null;
    resultadoRepCobranzaTB=null;
    unionJson = new Array();
  
    totalSuma = [{
      'bultosIni':0,
      'saldosIni':0,
      'bultos':0,
      'ventas':0,
      'pagos':0,
      'saldoFinal':0}];
    

    buscarTodo = false;
    buscaProd = {
      prod1: '',
      prod2: ''
    }
    loading = false;
   repCobranza(pProductor,pCliente,pFechaIni,pFechaFin){
    this.loading = true;
    this.unionJson.length=0;
    this.totalSuma = [{
      'bultosIni':0,
      'saldosIni':0,
      'bultos':0,
      'ventas':0,
      'pagos':0,
      'saldoFinal':0}];
     this.validarVacios();
     var fechainicial="";
     var fechafinal="";
    (function ($) {
      fechainicial= $("#txtfechaini").val();
      fechafinal= $("#txtfechafin").val();
    })(jQuery);

     
    this.llamarProcedimiento.param = 0;
     
    if(pProductor.substring(0,2) ==''){
      this.buscaProd.prod1 ='01';
      this.buscaProd.prod2 ='02';
      this.buscarTodo=true;
    }else{
      this.buscaProd.prod1 = pProductor.substring(0,2);
      this.buscarTodo=false;
    }
    console.log(this.buscaProd);

     this.llamarProcedimiento.procedure="Call rep_Cobranza('"+this.buscaProd.prod1+"','"+this.datoscaptura.cliente.substring(0,4)+"','"+fechainicial+"','"+fechafinal+"')";
     
     this.servicesService.StoreReportes(this.llamarProcedimiento,this.buscaProd.prod1)
      .then((Data)=>{
        this.resultadoRepCobranzaCH=Data;
        var arrayCH= [];
        arrayCH.push(this.resultadoRepCobranzaCH[this.resultadoRepCobranzaCH.length - 1]);

        if (this.buscarTodo) {
          this.llamarProcedimiento.procedure="Call rep_Cobranza('"+this.buscaProd.prod2+"','"+this.datoscaptura.cliente.substring(0,4)+"','"+fechainicial+"','"+fechafinal+"')";
          this.servicesService.StoreReportes(
          this.llamarProcedimiento,this.buscaProd.prod2).then((Data)=>{
          this.resultadoRepCobranzaTB=Data
          arrayCH.push(this.resultadoRepCobranzaTB[this.resultadoRepCobranzaTB.length - 1]);
            this.unionJson= this.resultadoRepCobranzaCH.concat(this.resultadoRepCobranzaTB);
            this.sumarResulatdos(arrayCH);
          }).catch(
              (error)=>{console.log("Error "+JSON.stringify(error))}
            );
        }else{
          this.unionJson= this.resultadoRepCobranzaCH;
          this.sumarResulatdos(arrayCH);
        }
        
        
        }).catch(
          (error)=>{console.log("Error "+JSON.stringify(error))}
        );
   }   

   sumarResulatdos(arrayCH){
      var total=0;
      var bultosIni =0;
      var saldosIni = 0;
      var bultos    =0;
      var ventas    =0;
      var pagos     =0;
      var saldoFinal=0;
      arrayCH.forEach(function (obj) {
        bultosIni += parseFloat (obj.BultosIni);
        saldosIni += parseFloat (obj.SaldoIni);
        bultos    += parseFloat (obj.Bultos);
        ventas    += parseFloat (obj.Ventas);
        pagos     += parseFloat (obj.Pagos);
        saldoFinal+= parseFloat (obj.SaldoFin);
      });
        

      this.totalSuma[0]['bultosIni'] =bultosIni ;
      this.totalSuma[0]['saldosIni']=saldosIni ;
      this.totalSuma[0]['bultos']=bultos    ;
      this.totalSuma[0]['ventas']=ventas    ;
      this.totalSuma[0]['pagos']=pagos     ;
      this.totalSuma[0]['saldoFinal']=saldoFinal; 

      this.loading = false;
      console.log(this.totalSuma);
   }

   imprimirPDF(){
    var divContents = document.getElementById('imprimirPDF').innerHTML; 
    //let originalContent = document.body.innerHTML;
    var a = window.open('','_blank', 'top=0,left=0,height=100%, width=auto'); 
    var fecha = new Date();
    var options = { day: 'numeric',month: 'long', year: 'numeric' };

      a.document.write(`
        <html>
          <head>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" 
          integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2"
          crossorigin="anonymous">
            <style>
              html, body { height: 100%; }
              body { margin: 0; font-family: Roboto, "Helvetica Neue", sans-serif;font-size: 12px; }
                table {
                  width: 100%;
                }
                .table td, 
                .table th {
                  border-top: 1px solid #dee2e6;
                }
            </style>
          </head>
          <body onload="window.print();window.close()">
            <div class="row">
              <h3 style="text-align: left;">
                <img src="assets/logoGrupoChaparral.png" width="25%">
                <b>Cobranza Nacional.</b>
              </h3>
            </div>
          <h5 style="text-align: center;">
            Fecha de impresión:${fecha.toLocaleDateString("es-ES", options)}
          </h5>          
              ${divContents}
          </body>
        </html>`);  
      a.document.close(); 
   }
  
}


export interface interfazCliente  {
  codigo:string;
  nombre:string;
}

export interface EmployeeProd  {
  codigo:string;
  nomcorto:string;
}

