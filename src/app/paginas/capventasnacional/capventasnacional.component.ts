import { Component, OnInit, ɵConsole } from '@angular/core';
import { ServiceService } from "../../servicios/service.service";
import { MatSnackBar, MatSnackBarHorizontalPosition,MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import { FormBuilder, Validators,FormGroup, FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
declare var jQuery: any;

export interface Employee  {
  codigo:string;
  nombre:string;
}
export interface EmployeeProd  {
  codigo:string;
  nomcorto:string;
}

export interface Comprobante  {
  codigo:string;
  nombre:string;
}
export interface TipoAjuste  {
  codigo:string;
  nombre:string;
}
@Component({ 
  selector: 'app-capventasnacional',
  templateUrl: './capventasnacional.component.html',
  styleUrls: ['./capventasnacional.component.css']
})
export class CapventasnacionalComponent implements OnInit {
  formGroup: FormGroup;
  employeeCtrl = new FormControl();
  filteredEmployee: Observable<Employee[]>;
  employees: Employee[] = [];

  productorCtrl = new FormControl();
  filteredEmployeeProd: Observable<EmployeeProd[]>;
  employeesProd: EmployeeProd[] = [];

  comprobanteCtrl = new FormControl();
  filteredComprobante: Observable<Comprobante[]>;
  comprobante: Comprobante[] = [];

  ajusteCtrl = new FormControl();
  filteredTipoAjuste: Observable<TipoAjuste[]>;
  tipoajuste: TipoAjuste[] = [];

  constructor(private servicesService: ServiceService,
    private _snackBar: MatSnackBar,formBuilder: FormBuilder
    ) 
    { 
      this.formGroup = formBuilder.group({
        productor: ['',Validators.required],
        cliente:['',Validators.required],
        manifiesto:['',Validators.required],
        factura:['',Validators.required],
        importe:[0,Validators.required],
        comprobante:['',Validators.required]
      });
    }


  ngOnInit(): void {
    this.metodoProductor();
    this.metodoCliente();
    this.metodoTipoComprobante(); 
    this.metodoTipoAjuste();
  }

 

  onFormSubmit() {
    //aqui validas los select 
    
    this.GuardarAbono();
    
  }

  datoscaptura={
    id:'',
    productor:'',
    cliente:'',
    manifiesto:'',
    factura:'',
    fecha:'',
    comprobante:'',
    notacredito:'',
    tipodeajuste:'',
    importe:null
  }

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  manifiestate:boolean=false;
  muestraAjuste:boolean=false;
  mostrarcombo =0;
  //VARIABLES NGMODEL 
  nIdManifiesto = 0;
  cFactura = "";
  cNotaDeCredito=""; 
  nImporte = 0;
  // OBTENER PRODUCTOR//////
  nCodigoProd="";
  resultado=null; 
  resultadoTipoAjuste=null;
  buscaSelect ={
    cCampos:null, cFrom:null, cWhere:null
  }
  buscaTipoAjuste ={
    cCampos:null, cFrom:null, cWhere:null
  }
  cachaProductor={
    codigo:null,nomcorto:null
  }  
  metodoProductor(){
    this.buscaSelect.cCampos="codigo,TRIM(nomcorto) AS nomcorto";
    this.buscaSelect.cFrom= "productor";
    this.buscaSelect.cWhere="";
    this.servicesService.selectQuery(this.buscaSelect).then(result=>this.resultado=result);
      this.employeesProd=this.resultado;
      this.filteredEmployeeProd = this.productorCtrl.valueChanges
      .pipe(
        startWith(''),
        map(productor => productor ? this._filterEmployeesprod(productor) : this.employeesProd.slice())
      );
   }
   ///////////////////////////
   // OBTENER CLIENTE //////
   nCodigoCliente = "";
   resultadoCliente =  null;
  
   buscaCliente ={
     cCampos:null,cFrom:null, cWhere:null
   }
   cachaCliente={
     codigo:null,nombre:null
   }
   seleccionaCliente:string[];
  //  states: string[] = [nombre:'','codigo':''];
   selectedStates = null; 
   metodoCliente(){
     this.buscaCliente.cCampos="codigo,TRIM(nombre) AS nombre";
     this.buscaCliente.cFrom=" manifiestos man inner join clientes cli on cli.codigo = man.cliente";
     this.buscaCliente.cWhere=" where Man.tipo = 'N' and Man.Cancelado = 0 group by codigo,nombre ";
     this.servicesService.selectQuery(this.buscaCliente).then(result=>this.resultadoCliente=result);
      this.employees=this.resultadoCliente;
      this.filteredEmployee = this.employeeCtrl.valueChanges
      .pipe(
        startWith(''),
        map(employee => employee ? this._filterEmployees(employee) : this.employees.slice())
      );
   }

   private _filterEmployees(value: string): Employee[] {
    const filterValue = value.toLowerCase();

    return this.employees.filter(state => state.nombre.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterEmployeesprod(value: string): EmployeeProd[] {
    const filterValue = value.toLowerCase();

    return this.employeesProd.filter(state => state.nomcorto.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterComprobante(value: string): Comprobante[] {
    const filterValue = value.toLowerCase();

    return this.comprobante.filter(state => state.nombre.toLowerCase().indexOf(filterValue) === 0);
  }
  private _filterTipoAjuste(value: string): TipoAjuste[] {
    const filterValue = value.toLowerCase();
    return this.tipoajuste.filter(state => state.nombre.toLowerCase().indexOf(filterValue) === 0);
  }

  // OBTENER EL CATALOGO DE TIPO DE AJUSTES 

  metodoTipoAjuste(){
    this.buscaTipoAjuste.cCampos="codigo,TRIM(nombre) AS nombre";
    this.buscaTipoAjuste.cFrom= "tipoajustes";
    this.buscaTipoAjuste.cWhere="";
    this.servicesService.selectQuery(this.buscaTipoAjuste).then(result=>this.resultadoTipoAjuste=result);
      this.tipoajuste=this.resultadoTipoAjuste;
      this.filteredTipoAjuste = this.ajusteCtrl.valueChanges
      .pipe(
        startWith(''),
        map(ajuste => ajuste ? this._filterTipoAjuste(ajuste) : this.tipoajuste.slice())
      );
   }

 // OBTENER COMPROBANTE //////
 nCodigoComprobante = "";
 resultadoTipoComprobante =  null;
 buscaComprobante ={
   cCampos:null,cFrom:null, cWhere:null
 }
 cachaTipoComprobante={
   codigo:null,nombre:null
 }
 metodoTipoComprobante(){
   this.buscaComprobante.cCampos="codigo,nombre,mostrar";
   this.buscaComprobante.cFrom="tipocomprobante";
   this.buscaComprobante.cWhere="";
   this.servicesService.selectQuery(
     this.buscaComprobante).then(result=>this.resultadoTipoComprobante=result);
        this.comprobante=this.resultadoTipoComprobante;
        this.filteredComprobante = this.comprobanteCtrl.valueChanges
        .pipe(
          startWith(''),
          map(comprob => comprob ? this._filterComprobante(comprob) : this.comprobante.slice())
        );
 }
 /////////////////////
  //TABLA GENERAL  
  nCodigoMan = 0;
  nTotal:number;
  
  //PARA OBTENER LOS MANIFIESTOS
  resultaManifiesto = null;  
  buscaSelectManifiesto = {procedure:null,param:null};
  resultaManifiestoAbono = null;
  
tablaGeneral: string[] = ['Manifiesto','Fecha', 'Bultos','Importe','Abonos','Ajustes','Saldos'];
tablaDetallado: string[] = ['Fecha','Abonos','notadecredito','Ajustes','Action'];

metodoManifiesto(){   
  
  this.buscaSelectManifiesto.procedure="CALL VentaNacional('"+this.datoscaptura.productor.substring(0,2)+"','"+this.datoscaptura.cliente.substring(0,4)+"')";
  this.buscaSelectManifiesto.param=0;
  this.servicesService.ejecutaStoreProc(
    this.buscaSelectManifiesto).subscribe(
      result => this.resultaManifiesto = result);
            
      setTimeout(() => {
        if(this.resultaManifiesto[0]['Fecha']==''){
          this.resultaManifiestoAbono=null;
        }else{
          if (this.pintar!==0) {
            let obj = this.resultaManifiesto.find((o,i)=>{
              if(o.id==this.pintar){
                this.nImporteAbono = parseInt(o.Abonos);
                this.nImporteAjuste= parseInt(o.Ajustes);
                console.log(o.Abonos);
                console.log(o.Ajustes);
              }           
             });
        }
          // var i=0;
          // console.log(this.resultaManifiesto);
          // if (this.pintar!==0) {
          //   for (let d of this.resultaManifiesto) {
          //     if (d['id']==this.pintar) {
          //       this.nImporteAbono = parseInt(d['Abonos']);
          //       this.nImporteAjuste= parseInt(d['Ajustes']);
          //     }
          //     i++;
          //   }
          // }
          
        }
       
      }, 1000);
      
}

establecerCursor(evento){
  document.getElementById(evento).focus();
  if(evento=='txtManifiesto'){
    this.metodoManifiesto(); 
  }
}
    nImporteAbono=0;
    nImporteTotal=0;
    nImporteAjuste=0;
  enviarFolio(paramfolio){
    this.datoscaptura.id=paramfolio.Manifiesto;
    //this.cFactura=  paramfolio.Factura;
    this.datoscaptura.manifiesto=paramfolio.Manifiesto;
    this.datoscaptura.factura=paramfolio.Factura;
    this.datoscaptura.importe = parseFloat(paramfolio.Saldos);
    this.nImporteAbono = parseFloat(paramfolio.Abonos);
    this.nImporteAjuste= parseFloat(paramfolio.Ajustes);
    this.nImporteTotal=parseFloat(paramfolio.Importe);
  }
  pintar=0; 
  
  metodoCargaVentaDetalle(paramId){ // el parametro cacha todos los datos de la fila 
    this.pintar=paramId;
   // console.log(paramId);
    
    this.nIdManifiesto=paramId;
    this.buscaSelectManifiesto.procedure="Call VentaNacionalAbono("+ this.nIdManifiesto+")";
    this.buscaSelectManifiesto.param=0
    this.servicesService.ejecutaStoreProc(
    this.buscaSelectManifiesto).subscribe(result=>this.resultaManifiestoAbono=result);
      //validar si retorno datos
      
      setTimeout(()=>{
        if(this.resultaManifiestoAbono['mensaje'] ){
          this.resultaManifiestoAbono=null;
          //LLAMAR UN METODO PARA LIMPIAR LOS NGMODEL 
         // this.LimpiarVariables();
        }
      },1000)

  }

  // cargaDetalle(paramDetalle){
  //   this.datoscaptura.fecha = paramDetalle.Fecha;
  //   this.datoscaptura.importe=paramDetalle.Importe;
  // }

  getTotalCost(pArray,pCampo) {
    // if(this.manifiestate==true && this.resultaManifiesto!=null){
      var cCadena = "this."+pArray+".map(t => parseInt(t."+pCampo+")).reduce((acc, value) => acc + value, 0);"
      return  eval(cCadena);
     // this.resultaManifiesto.map(campo => parseInt(campo.attcampo)).reduce((acc, value) => acc + value, 0);
      // 
    // }
  }
  muestracombo(){    
    var str = this.datoscaptura.comprobante;
    this.mostrarcombo =parseInt(str.substring(0, 1));
  }

  guardarAbono = {
    idManifiesto:null,
    Fecha: '',
    Importe:null,
    Factura:null,
    NotaCredito:null,
    TipoDeAjuste:null,
    Liquido:null
  }

  nSuma =0;
  GuardarAbono(){
    var fechaCaptura="";
    (function ($) {
      fechaCaptura= $("#txtfecha").val();
    })(jQuery);
    if(this.datoscaptura.importe==0){
      this.datoscaptura.importe=null;
      return};
    this.guardarAbono.idManifiesto = this.nIdManifiesto;
    this.guardarAbono.Fecha = fechaCaptura;
    this.guardarAbono.Importe = this.datoscaptura.importe;
    console.log(this.datoscaptura.importe);
    this.guardarAbono.Factura=this.datoscaptura.factura;
    this.guardarAbono.Liquido = 0;
    this.nSuma=this.datoscaptura.importe+this.nImporteAbono+this.nImporteAjuste;  

    // console.log(this.datoscaptura.importe);
    // console.log(this.nImporteAbono);
    // console.log(this.nImporteAjuste);
    // console.log(this.datoscaptura.importe+this.nImporteAbono+this.nImporteAjuste);
  
    if(this.muestraAjuste!=true){
        this.guardarAbono.NotaCredito='';
        this.guardarAbono.TipoDeAjuste='';
      }else{
        this.guardarAbono.NotaCredito=this.datoscaptura.notacredito;
        this.guardarAbono.TipoDeAjuste=this.datoscaptura.tipodeajuste.substring(0,2);
      }     
      
    if(this.nSuma>this.nImporteTotal){
      this._snackBar.open('Captura Mayor que el total del Manifiesto!!', 'VERIFICA', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }else{
      if(this.nSuma == this.nImporteTotal){
          this.guardarAbono.Liquido = 1;
      }
      //console.log(this.guardarAbono);
      this.servicesService.guardaVentaNacional(this.guardarAbono).subscribe(
        (datos)=>{
          
          if (datos["varExito"]=='Ok') {
            // alert (datos["msjExito"]);                 
            this.metodoManifiesto();               
          }
        }
       );        
       this.metodoCargaVentaDetalle(this.guardarAbono.idManifiesto);
       this.datoscaptura.importe=null;
       this.datoscaptura.factura='';
       this.datoscaptura.comprobante='';
    }
  }

  LimpiarVariables(){
    this.datoscaptura.productor="";
    this.datoscaptura.cliente="";
    this.datoscaptura.manifiesto="";
    // this.datoscaptura.factura="";
    this.datoscaptura.fecha='';
    // this.nCodigoComprobante="";
    // this.cNotaDeCredito="";
    this.datoscaptura.importe=0;
  }

  jSonParaEliminar={
    id:null,
    tabla:null,
    idmanifiesto:null
  }

  EliminarPago(detalle){
    this.jSonParaEliminar.id=detalle.Id;
    this.jSonParaEliminar.tabla=detalle.NomTabla;
    this.jSonParaEliminar.idmanifiesto=this.nIdManifiesto;
    //console.log(this.jSonParaEliminar);
    this.servicesService.eliminaVentaDetalleNacional(this.jSonParaEliminar).subscribe((datos)=>{
      if(datos["varExito"]=='Ok'){
        this.metodoManifiesto();
        this.metodoCargaVentaDetalle(this.nIdManifiesto)
      }
    })
  }



 }
