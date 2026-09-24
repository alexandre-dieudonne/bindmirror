import {Component, computed, input} from '@angular/core';
import {Variant, variantTagClasses} from '../../constants/variants';

export type TagVariant = Variant | 'outline';

const TAG_OUTLINE_CLASS = 'border border-accent text-accent';

@Component({
    selector: 'app-tag',
    imports: [],
    templateUrl: './tag.component.html',
})
export class TagComponent {
    variant = input<TagVariant>('neutral');
    variantClass = computed(() =>
        this.variant() === 'outline' ? TAG_OUTLINE_CLASS : variantTagClasses[this.variant() as Variant]);
}
