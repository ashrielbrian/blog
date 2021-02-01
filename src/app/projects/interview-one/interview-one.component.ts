import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

const gistUrlSources = {
  abbreviate: 'https://gist.github.com/ashrielbrian/79bd70dfc87754fe11abc995c9a2ea7c.js',
  topkiFrame: 'https://gist.github.com/ashrielbrian/5a4247503e9e8fc8f3d200fb1b3c9f40.js',
}

@Component({
  selector: 'app-interview-one',
  templateUrl: './interview-one.component.html',
  styleUrls: ['./interview-one.component.css']
})

export class InterviewOneComponent implements OnInit, AfterViewInit {

  constructor(private renderer: Renderer2) { }

  @ViewChild('abbreviateiFrame') abbreviateiFrame: ElementRef;
  @ViewChild('topkiFrame') topkiFrame: ElementRef;

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.buildGist(this.abbreviateiFrame, gistUrlSources.abbreviate);
    this.buildGist(this.topkiFrame, gistUrlSources.topkiFrame);
  }

  buildGist(iframe: ElementRef, scriptSrc: string) {
    const doc = iframe.nativeElement.contentDocument || iframe.nativeElement.contentWindow;
    const content = `
      <html>
        <head>
            <base target="_parent">
        </head>
        <body>
            <script type="text/javascript" src="${scriptSrc}"></script>
        </body>
      </html>
    `;
    
    doc.open();
    doc.write(content);
    let ht = iframe.nativeElement.contentWindow.document;
    let t = iframe.nativeElement.contentWindow.document.body;
    console.log(t.height, t.innerHeight, t.scrollHeight, t.outerHeight, t.offsetHeight);
    console.log(ht)
    console.log(ht.clientHeight, ht.innerHeight, ht.scrollHeight, ht.outerHeight, ht.offsetHeight)
    // sets the height dynamically according to the content height
    this.renderer.setStyle(iframe.nativeElement, 'height', iframe.nativeElement.contentWindow.outerHeight + 50 + 'px')
    doc.close();
  }

}
