import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import WebViewer, {WebViewerInstance} from "@pdftron/webviewer";
import {Subject} from "rxjs";

@Component({
  selector: 'app-root',
  styleUrls: ['app.component.css'],
  templateUrl: 'app.component.html'
})
export class AppComponent implements AfterViewInit {
  wvInstance?: WebViewerInstance;
  
  @ViewChild('viewer') viewer!: ElementRef;
  
  @Output() coreControlsEvent:EventEmitter<string> = new EventEmitter();

  private documentLoaded$: Subject<void>;

  constructor() {
    this.documentLoaded$ = new Subject<void>();
  }

  ngAfterViewInit(): void {

    WebViewer({
      path: '../lib',
      initialDoc: '../files/sample.pdf',
      licenseKey: 'your_license_key'  // sign up to get a free trial key at https://dev.apryse.com
    }, this.viewer.nativeElement).then(instance => {
      this.wvInstance = instance;

      this.coreControlsEvent.emit(instance.UI.LayoutMode.Single);

      const { documentViewer, Annotations, annotationManager } = instance.Core;

      instance.UI.openElements(['notesPanel']);

      documentViewer.addEventListener('annotationsLoaded', () => {
        console.log('annotations loaded');
      });

      documentViewer.addEventListener('documentLoaded', async () => {
        this.documentLoaded$.next();
       

        const flags = new Annotations.WidgetFlags();
        flags.set(Annotations.WidgetFlags.MULTILINE, false);
        flags.set(Annotations.WidgetFlags.REQUIRED, false);

        const field = new Annotations.Forms.Field("textBoxField", {
          type: 'Tx',
          flags: flags,
        });

        const textBoxWidget = new Annotations.TextWidgetAnnotation(field, {});// {transparentBackground: "false"}
        // textBoxWidget.addCustomAppearance(this.getDocument(), {transparentBackground: "false"});
        textBoxWidget.setHeight(50);
        textBoxWidget.setWidth(200);
        textBoxWidget.setX(100);
        textBoxWidget.setY(150);
        textBoxWidget.setPageNumber(1);
        annotationManager.getFieldManager().addField(field);
        annotationManager.addAnnotation(textBoxWidget, {imported: true});
        await annotationManager.drawAnnotationsFromList([textBoxWidget]);


      });

    })

  }

  async createTextbox(){
    if(!this.wvInstance){
      console.error("wvInstance undefined")
      return;
    }
    const { documentViewer, Annotations, annotationManager } = this.wvInstance.Core;

    const flags = new Annotations.WidgetFlags();
    flags.set(Annotations.WidgetFlags.MULTILINE, false);
    flags.set(Annotations.WidgetFlags.REQUIRED, false);

    const field = new Annotations.Forms.Field("textBoxField", {
      type: 'Tx',
      flags: flags,
    });

    const textBoxWidget = new Annotations.TextWidgetAnnotation(field, {});// {transparentBackground: "false"}
    // textBoxWidget.addCustomAppearance(this.getDocument(), {transparentBackground: "false"});
    textBoxWidget.setHeight(50);
    textBoxWidget.setWidth(200);
    textBoxWidget.setX(300);
    textBoxWidget.setY(300);
    textBoxWidget.setPageNumber(1);
    annotationManager.getFieldManager().addField(field);
    annotationManager.addAnnotation(textBoxWidget, {imported: true});
    await annotationManager.drawAnnotationsFromList([textBoxWidget]);
  }
}
