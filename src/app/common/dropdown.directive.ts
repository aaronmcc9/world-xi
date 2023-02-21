// import { Directive, ElementRef, HostBinding, HostListener } from "@angular/core";

// @Directive({
//     selector: '[appDropdown]'
// })
// export class DropdownDirective{
//     @HostBinding('class.open') isOpen = false;
//     @HostListener('document:click', ['$event']) toggleOpen(event:Event){
//         this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
//     }

//     constructor(private elRef: ElementRef) {
//     }
// }
import {Directive, ElementRef, HostBinding, HostListener} from '@angular/core';
 
@Directive({
  selector: '[appDropdown]',
  exportAs:'appDropdown'
})
export class DropdownDirective {
  @HostBinding('class.open') isOpen = false;
  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    console.log("event", event.target, this.elRef.nativeElement.contains(event.target))
    this.isOpen = this.elRef.nativeElement.contains(event.target) ? true : false;
  }
  constructor(private elRef: ElementRef) {}
}