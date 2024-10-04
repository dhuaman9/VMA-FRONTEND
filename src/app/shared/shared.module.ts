import { NgModule } from '@angular/core';

import {TableModule} from "primeng/table";
import {PaginatorModule} from "primeng/paginator";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {DynamicDialogModule} from "primeng/dynamicdialog";
import {RadioButtonModule} from "primeng/radiobutton";
import {DropdownModule} from "primeng/dropdown";
import {InputSwitchModule} from "primeng/inputswitch";
import {DialogModule} from "primeng/dialog";
import {KeyFilterModule} from "primeng/keyfilter";
import {FieldsetModule} from "primeng/fieldset";
import {CalendarModule} from "primeng/calendar";
import {AccordionModule} from "primeng/accordion";
import {ToastModule} from "primeng/toast";
import {SplitterModule} from "primeng/splitter";
import {FileUploadModule} from "primeng/fileupload";
import {TooltipModule} from "primeng/tooltip";
import {ChartModule} from "primeng/chart";
import {OrderListModule} from "primeng/orderlist";
import {TagModule} from "primeng/tag";
import {MessageModule} from "primeng/message";
import {LoadingComponent} from "../pages/loading/loading.component";
const PRIMENG_COMPONENTS = [
  TableModule,
  PaginatorModule,
  ButtonModule,
  InputTextModule,
  DynamicDialogModule,
  RadioButtonModule,
  DropdownModule,
  InputSwitchModule,
  DialogModule,
  KeyFilterModule,
  FieldsetModule,
  CalendarModule,
  AccordionModule,
  ToastModule,
  SplitterModule,
  FileUploadModule,
  TooltipModule,
  ChartModule,
  OrderListModule,
  TagModule,
  MessageModule
]

@NgModule({
  declarations: [
    LoadingComponent
  ],
  imports: [
    PRIMENG_COMPONENTS
  ],
  exports: [
    PRIMENG_COMPONENTS,
    LoadingComponent
  ]
})
export class SharedModule { }
