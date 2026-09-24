import {afterRenderEffect, Component, computed, ElementRef, input, model, signal, viewChild, viewChildren} from '@angular/core';
import {OverlayModule} from '@angular/cdk/overlay';
import type {FormValueControl} from '@angular/forms/signals';

@Component({
  selector: 'app-custom-select',
  imports: [OverlayModule],
  templateUrl: './custom-select.component.html',
})
export class CustomSelectComponent implements FormValueControl<string> {
    value = model('');
    placeholder = input('Select a preset');
    disabled = input(false);
    readonly displayValue = computed(() => this.value() || this.placeholder());
    readonly popupExpanded = signal(false);
    readonly labels = input<string[]>([]);

    readonly searchTerm = signal('');
    readonly filteredLabels = computed(() => {
        const term = this.searchTerm().trim().toLowerCase();
        return term ? this.labels().filter((label) => label.toLowerCase().includes(term)) : this.labels();
    });

    readonly highlightedIndex = signal(0);

    searchEl = viewChild<ElementRef<HTMLInputElement>>('searchEl');
    itemEls = viewChildren<ElementRef<HTMLElement>>('itemEl');

    constructor() {
        afterRenderEffect(() => {
            if (this.popupExpanded()) this.searchEl()?.nativeElement.focus();
        });
        afterRenderEffect(() => {
            if (this.popupExpanded()) {
                this.itemEls()[this.highlightedIndex()]?.nativeElement.scrollIntoView({block: 'nearest'});
            }
        });
    }

    toggle() {
        if (this.disabled()) return;
        this.searchTerm.set('');
        this.highlightedIndex.set(0);
        this.popupExpanded.set(!this.popupExpanded());
    }

    close() {
        this.popupExpanded.set(false);
    }

    onSearchInput(term: string) {
        this.searchTerm.set(term);
        this.highlightedIndex.set(0);
    }

    moveHighlight(delta: number) {
        const count = this.filteredLabels().length;
        if (!count) return;
        this.highlightedIndex.update((i) => (i + delta + count) % count);
    }

    selectHighlighted() {
        const label = this.filteredLabels()[this.highlightedIndex()];
        if (label) this.select(label);
    }

    select(label: string) {
        this.value.set(label);
        this.popupExpanded.set(false);
    }

    itemClass(index: number, label: string): string {
        const classes: string[] = [];
        if (label === this.value()) classes.push('text-accent bg-accent/5');
        if (index === this.highlightedIndex()) classes.push('ring-1 ring-accent');
        return classes.join(' ');
    }
}
