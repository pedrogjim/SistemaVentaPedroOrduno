import { Component,ViewChild, OnInit, ElementRef } from '@angular/core';
import { ServiceService } from "../../servicios/service.service";
import { FormGroup, FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
declare var jQuery: any;

@Component({
  selector: 'app-repedoctacliente',
  templateUrl: './repedoctacliente.component.html',
  styleUrls: ['./repedoctacliente.component.css']
})
export class RepedoctaclienteComponent implements OnInit {
    constructor(private servicesService: ServiceService) {
  }

  ngOnInit(): void {
    this.metodoProductor();
    this.metodoCliente();
  }
  datoscaptura={
    productor:'',
    cliente:'',
  }
  
  llamarProcedimiento = {procedure:null,param:null};
  repEdoCtaCliente = null;
  resultado=null; 
  mostrarTablas:boolean=false;

  formGroup: FormGroup;
  employeeCtrl = new FormControl();
  filteredEmployee: Observable<Employee[]>;
  employees: Employee[] = [];

  productorCtrl = new FormControl();
  filteredEmployeeProd: Observable<EmployeeProd[]>;
  employeesProd: EmployeeProd[] = [];

  productorCh = "";
  productorTb= "";

  repEdoCtaCliente01 = null;
  repEdoCtaCliente02 = null;
  mostrarTablaCh:boolean=false;
  mostrarTablaTb:boolean=false;

  EdoCtaCliente(productor,cliente){ // el parametro cacha todos los datos de la fila    
    
    this.mostrarTablaCh=false;
    this.mostrarTablaTb=false;
    if(productor.substring(0,2)=='01' || productor.substring(0,2)=='02'){
      (function ($) {
        $('table#tbltotaldeuda tfoot th:nth-child(3)').text(0);
        $('table#tbltotaldeuda tfoot th:nth-child(4)').text(0);
        $('table#tbltotaldeuda tfoot th:nth-child(11)').text(0);
      })(jQuery);
      
      // PROCEDIMIENTO PARA LLAMAR CHAPARRAL
        this.llamarProcedimiento.procedure="Call rep_EdoCtaClientes('"+'01'+"','"+cliente.substring(0,4)+"')";
        this.llamarProcedimiento.param=1;
        this.servicesService.StoreReportes(
          this.llamarProcedimiento,'01').then(result=>{
            this.repEdoCtaCliente01=result;
            if(this.repEdoCtaCliente01[0]["Vacio"]==""){
              this.repEdoCtaCliente01=null;
              this.llamarproctombell(cliente);
            }else{
              this.mostrarTablaCh=true;
              this.productorCh=this.repEdoCtaCliente01[0]['NomProductor'];
              setTimeout(() => {
                this.prueba('tblKardexValorizado');
                this.prueba('tblKardexValorizado1'); 
                this.llamarproctombell(cliente);
               
              }, 500);
            } 

          });
          // setTimeout(() => {

            
          // }, 1000);
    }else{    
        // this.llamarProcedimiento.procedure="Call rep_EdoCtaClientes('"+productor.substring(0,2)+"','"+cliente.substring(0,4)+"')";
        // this.servicesService.ejecutaStoreProc(
        // this.llamarProcedimiento).subscribe(result=>this.repEdoCtaCliente=result);      
        // setTimeout(()=>{      
        //   if(this.repEdoCtaCliente[0]["Vacio"] == "" ){
        //     this.repEdoCtaCliente=null;
        //       this.mostrarTablas=false;
        //     }
        //     else{
        //       this.mostrarTablas=true;
        //       this.productorCh=this.repEdoCtaCliente[0]['NomProductor'];
        //     }
        //   },1000)
      }
    }

    llamarproctombell(cliente){
      //console.log("va buscar datos de tombell");
      this.mostrarTablaTb=false;
      this.llamarProcedimiento.procedure="Call rep_EdoCtaClientes('"+'02'+"','"+cliente.substring(0,4)+"')";
      this.servicesService.StoreReportes(
      this.llamarProcedimiento,'02').then(result=>{
        this.repEdoCtaCliente02=result;

        if(this.repEdoCtaCliente02[0]["Vacio"]==""){
          this.repEdoCtaCliente02=null;
          this.sumartotaldebe();
        }else{
          this.mostrarTablaTb=true;
          this.productorTb=this.repEdoCtaCliente02[0]['NomProductor'];
  
          setTimeout(() => {
            this.prueba('tblKardexValorizadotb');
            this.prueba('tblKardexValorizadotb1'); 
            //console.log("vasumar el total de debe ");
            
            this.sumartotaldebe();
          }, 500);
        }            
      });
        // setTimeout(() => {
        // }, 1000);
    }

  buscaSelect ={
    cCampos:null, cFrom:null, cWhere:null
  }
  cachaProductor={
    codigo:null,nomcorto:null
  }  
  
  metodoProductor(){
    this.buscaSelect.cCampos="codigo,TRIM(nomcorto) AS nomcorto";
    this.buscaSelect.cFrom= "productor";
    this.buscaSelect.cWhere="";
    this.servicesService.selectQuery(this.buscaSelect).then((result)=>{
      this.resultado=result
      this.employeesProd=this.resultado;
      this.filteredEmployeeProd = this.productorCtrl.valueChanges
      .pipe(
        startWith(''),
        map(productor => productor ? this._filterEmployeesprod(productor) : this.employeesProd.slice())
      );
    });
   }

    nCodigoCliente = "";
   resultadoCliente =  null;
  
   buscaCliente ={
     cCampos:null,cFrom:null, cWhere:null
   }
   cachaCliente={
     codigo:null,nombre:null
   }
   seleccionaCliente:string[];
   metodoCliente(){
    this.buscaCliente.cCampos="codigo,TRIM(nombre) AS nombre";
    this.buscaCliente.cFrom="clientes";
    this.buscaCliente.cWhere=" order by nombre";
    this.servicesService.selectQuery(this.buscaCliente).then((result)=>{
    this.resultadoCliente=result
    this.employees=this.resultadoCliente;
    this.filteredEmployee = this.employeeCtrl.valueChanges.pipe(startWith(''),map(employee => employee ? this._filterEmployees(employee) : this.employees.slice())
      );
     });
   }

   nTotalManifiesto = 0;
   nSeguro = 0
   nAbonos=0;
   nAjuste=0;
   nSaldo=0;
  //  campoSuma,
   i=0;
  
  getTotalFiltrado(tipo,resultadotabla){
    var nSuma=0;
    this.nTotalManifiesto=0;
    this.nSeguro=0;
    this.nAbonos=0;
    this.nAjuste=0;
    this.nSaldo=0;
    //console.log(this.nSaldo);
    //console.log(tipo);
    // var cCadena= "d."+campoSuma;
     var cTabla = eval("this."+resultadotabla)
    //console.log(cTabla);
    
    for (let d of cTabla) {     
      if(parseInt(d.Pagado)==tipo){                
        this.nTotalManifiesto = this.nTotalManifiesto + parseInt(d.TotalManifiesto);
        this.nSeguro = this.nSeguro + parseInt(d.Seguro);
        this.nAbonos = this.nAbonos + parseInt(d.Abonos);
        this.nAjuste = this.nAjuste + parseInt(d.Ajuste);
        this.nSaldo = this.nSaldo + parseInt(d.Saldo);
        console.log(this.nSaldo);
        //  nSuma = nSuma + parseInt(eval(cCadena));
      }      
    }
    this.i++;
    // return nSuma;
    return true;
    
  }

  nDeudaGeneral = 0;
  getDebe(resultadoTabla){
    var nDebe=0;
    var cTablaDebe = eval("this."+resultadoTabla);
          
    for (let d of cTablaDebe) {     
      nDebe = nDebe + parseInt(d.Saldo);
    }     
      this.nDeudaGeneral = this.nDeudaGeneral + nDebe ; 
      // console.log(nDebe);
      // console.log(this.nDeudaGeneral);
      
    return nDebe;
  }

   private _filterEmployees(value: string): Employee[] {
    const filterValue = value.toLowerCase();

    return this.employees.filter(state => state.nombre.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterEmployeesprod(value: string): EmployeeProd[] {
    const filterValue = value.toLowerCase();

    return this.employeesProd.filter(state => state.nomcorto.toLowerCase().indexOf(filterValue) === 0);
  } 

  pdf(cParaMId){
    var divContents = document.getElementById(cParaMId).innerHTML; 
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
              body { margin: 0; font-family: Roboto, "Helvetica Neue", sans-serif; }
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
            <h3 style="text-align: center;">
             <img src="assets/logoGrupoChaparral.png" width="25%">
             <b>Estado de cuenta por clientes de ventas nacionales.</b>
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
  
  prueba(pid){
    var i;
    var bandera=0;
    (function ($) {
        for(i=4;i<=10;i++)
        {
          var total=0;
          $('table#'+pid+' tbody td:nth-child(' + i + ')').each(function(index) 
          {
            var res =parseFloat($(this).text().replace(/[$,]/gi,'')) ;  

            if (i !== 6) {
              total += res;  
            }
            bandera= 1;
          });

          if (i !== 6) {
            var value = new Intl.NumberFormat().format(total);  // i.e. some decimal number
            $('table#'+pid+' tfoot th:nth-child(' + i + ')').text("$"+ value);
          } 

          if (pid == "tblKardexValorizado1" && i ==9){
            $('table#tbltotaldeuda tfoot th:nth-child(3)').text("$"+ total);
          }
          if (pid == "tblKardexValorizadotb1" && i ==9){
            $('table#tbltotaldeuda tfoot th:nth-child(4)').text("$"+ total);
          }          
        }
        //PARA MOSTRAR LAS TABLAS SI TIENEN DATOS Y OCULTAR CUANDO NO 
        if(bandera==0){
          //console.log("ocultar la tabla #"+pid);
          $("#"+pid).hide();
        }else{
         // console.log("Mostro Tabla .Show()"+pid);
          $('#'+pid).show();
        }
    })(jQuery);
      
    return true;
  }

  // adeudoTot =0;
  sumartotaldebe (){
    //console.log("ya esta sumando");
    
    var i;
    var total=0;
    (function ($) {
      if ($('#tbltotaldeuda').is(':hidden')) {
        return false
      } else {
        for(i=3;i<=4;i++)
        {
          // tblKardexValorizado1
          $('table#tbltotaldeuda tfoot th:nth-child(' + i + ')').each(function(index) 
          {
            var res =parseFloat($(this).text().replace(/[$,]/gi,'')) ;  
            total += res;  
            console.log(total);
            
          });
          var totalformateado = new Intl.NumberFormat().format(total);
          $('table#tbltotaldeuda tfoot th:nth-child(11)').text("$"+ totalformateado);
        }  
        
        // this.adeudoTot = total;
      }   
    })(jQuery);
  }
}

export interface Employee  {
  codigo:string;
  nombre:string;
}
export interface EmployeeProd  {
  codigo:string;
  nomcorto:string;
}




