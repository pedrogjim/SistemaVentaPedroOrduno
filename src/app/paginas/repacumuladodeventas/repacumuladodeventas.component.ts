import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import { ServiceService } from "../../servicios/service.service";
import {startWith, map} from 'rxjs/operators';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

declare var jQuery: any;

@Component({
  selector: 'app-repacumuladodeventas',
  templateUrl: './repacumuladodeventas.component.html',
  styleUrls: ['./repacumuladodeventas.component.css']
})
export class RepacumuladodeventasComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
loading = false;
  constructor(private servicesService: ServiceService,private _snackBar: MatSnackBar) { }

  dataForExcel = [];

  ngOnInit(): void {
    this.metodoProductor();
  }

  private _filtraProductor(value: string): ProductorInterface[] {
    const filterValue = value.toLowerCase();

    return this.productorInter.filter(state => state.nomcorto.toLowerCase().indexOf(filterValue) === 0);
  } 

  productorCtrl = new FormControl();
  filtrarProductor: Observable<ProductorInterface[]>;
  productorInter: ProductorInterface[] = [];
  resultado=null; 
  datoscaptura ={
    productor:'',
    fechaini:'',
    fechafin:''
  }

  llamarProcedimiento = {procedure:null,param:null};

  fieldArray: Array<any> = [];
  newAttribute: any={};

  metodoProductor(){
    this.buscaSelect.cCampos="codigo,TRIM(nomcorto) AS nomcorto";
    this.buscaSelect.cFrom= "productor";
    this.buscaSelect.cWhere="";
    this.servicesService.selectQuery(this.buscaSelect).then((result)=>{
      this.resultado=result
      this.productorInter=this.resultado;
      this.filtrarProductor = this.productorCtrl.valueChanges
        .pipe(
          startWith(''),
          map(productor => productor ? this._filtraProductor(productor) : this.productorInter.slice())
        );
    });
    
   }
   buscaSelect ={
    cCampos:null, cFrom:null, cWhere:null
  }
  cachaProductor={
    codigo:null,nomcorto:null
  } 

  // "Call rep_EdoCtaClientes('"+'02'+"','"+cliente.substring(0,4)+"')";
  resultadoExcel =null;
  generarExcel(){ 
    this.loading = true;
    var fechainicial="";
    var fechafinal="";
    var productor = "";
    (function ($) {
      productor = $("#productor").val();
      fechainicial= $("#txtfechaini").val();
      fechafinal= $("#txtfechafin").val();
    })(jQuery);

    //validar parametros obligatorios 
    if (productor == "" || fechainicial =="" || fechafinal == "") {
      this.messageBox("Hay campos Vacios....!!!! ");
      return;
      
    }



    this.llamarProcedimiento.param = 0
    this.llamarProcedimiento.procedure="Call rep_acumuladoVentas('"+this.datoscaptura.productor.substring(0,2)+"','"+fechainicial+"','"+fechafinal+"')"
    
  //  console.log(this.llamarProcedimiento);
    this.servicesService.StoreReportes(this.llamarProcedimiento,this.datoscaptura.productor.substring(0,2))
      .then((result)=>{
        this.resultadoExcel=result
        for(let d of this.resultadoExcel){
          this.newAttribute.productor      =d[0];
          this.newAttribute.pallet         =d[1];
          this.newAttribute.idmanifiesto   =d[2];
          this.newAttribute.foliomanifiesto=d[3];
          this.newAttribute.Fecha          =d[4];
          this.newAttribute.Año            =d[5]; 
          this.newAttribute.Semanas        =d[6];
          this.newAttribute.Calidad        =d[7];
          this.newAttribute.Columna1       =d[8];
          this.newAttribute.Concatenar     =d[9];
          this.newAttribute.Presentacion   =d[10];
          this.newAttribute.NomPresenta    =d[11];
          this.newAttribute.Columna2       =d[12];
          this.newAttribute.Etiqueta       =d[13];
          this.newAttribute.NomEtiqueta    =d[14];
          this.newAttribute.cliente        =d[15];
          this.newAttribute.nomcliente     =d[16];
          this.newAttribute.cantidad       =d[17];
          this.newAttribute.Precio         =d[18];
          this.newAttribute.VentaNeta      =d[19];
          this.newAttribute.Producto       =d[20];
          this.newAttribute.NomProduc      =d[21];
          this.newAttribute.Envase         =d[22];
          this.newAttribute.familia        =d[23];
          this.newAttribute.Libras         =d[24];
          this.newAttribute.ch25Dia        =d[25];
          this.fieldArray.push(this.newAttribute)
          this.newAttribute={};
        }
        // agrega lo que trae en cada fila 
        this.fieldArray.forEach((row: any) => {
          this.dataForExcel.push(Object.values(row))
        })
        let reportData = {
          title: 'EXPORTAR A EXCEL',
          data: this.dataForExcel,
          headers: Object.keys(this.fieldArray[0])
        }
        this.loading = false;
        this.exportaraExcel(reportData);
      }).catch(
        (error)=>{console.log("Error "+JSON.stringify(error))}
      );
        // guardar en un array el resultado de la api 
        
        
    //setTimeout(() => {

    //}, 1000);   

   
  }  

    exportaraExcel(excelData){

        //Title, Header & Data
        const title = excelData.title;
        const header = excelData.headers
        const data = excelData.data;

        //Create a workbook with a worksheet
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet('Reporte Acumulado de Ventas');
      
        //Adding Header Row
        let headerRow = worksheet.addRow(header);
        headerRow.eachCell((cell, number) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '4167B8' },
            bgColor: { argb: '' }
          }
          cell.font = {
            bold: true,
            color: { argb: 'FFFFFF' },
            size: 12
          }
        })

        // Adding Data with Conditional Formatting
        data.forEach(d => {
          worksheet.addRow(d);
        });
        //Generate & Save Excel File
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, title + '.xlsx');
        })
      }


      messageBox(pMensaje){
        this._snackBar.open(pMensaje, 'Verifica !!!', {
          duration: 2000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
}

export interface ProductorInterface  {
  codigo:string;
  nomcorto:string;
}


export class Color{
  one: String;
  two: String;
}


















