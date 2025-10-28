import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';

@Directive({
    selector: '[appDropdown]',
    exportAs: 'appDropdown'
})
export class DropdownDirective {
    @HostBinding('class.open') isOpen = false;
    @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
        if (!this.elRef.nativeElement.contains(event.target))
            this.isOpen = false;

    }

    setOpen(open: boolean) {
        this.isOpen = open;
    }

    constructor(private elRef: ElementRef) { }
}