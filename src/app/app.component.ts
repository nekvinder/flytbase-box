import { Component } from '@angular/core';
import { HostListener } from '@angular/core';
import { Box } from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // Configurations
  jumpConstant = 20;
  limit = {
    x: 50,
    y: 50,
    height: 800,
    width: 1000,
  };

  //State Vars
  boxes: Box[] = [];
  title = 'Flyt 3D Boxes';
  keyboardListening = false;

  newBox() {
    const newId = Math.max(...this.boxes.map((b) => b.id), 0) + 1;
    this.boxes.push({
      x: this.limit.x + 5,
      y: this.limit.y + 5,
      height: 100,
      width: 300,
      id: newId,
      isSelected: false,
    });
  }
  setSelected(box: Box) {
    this.boxes.forEach((b) => (b.isSelected = b.id == box.id));
    this.boxes = Object.assign(this.boxes, this.boxes); // trigger re-render
  }
  get selectedBox(): Box {
    return this.boxes.filter((b) => b.isSelected)[0];
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {}
  toggleHandleKeyboardEvent() {
    if (this.keyboardListening) {
      this.handleKeyboardEvent = () => {};
      this.keyboardListening = false;
    } else {
      this.handleKeyboardEvent = (event: KeyboardEvent) => {
        if (this.selectedBox) {
          if (['ArrowUp', 'w', 'W'].includes(event.key))
            this.selectedBox.y = Math.max(
              this.selectedBox.y - this.jumpConstant,
              this.limit.y
            );
          if (['ArrowDown', 's', 'S'].includes(event.key))
            this.selectedBox.y = Math.min(
              this.selectedBox.y + this.jumpConstant,
              this.limit.y + this.limit.height - this.selectedBox.height - 2
            );
          if (['ArrowLeft', 'a', 'A'].includes(event.key))
            this.selectedBox.x = Math.max(
              this.selectedBox.x - this.jumpConstant,
              this.limit.x
            );
          if (['ArrowRight', 'd', 'D'].includes(event.key))
            this.selectedBox.x = Math.min(
              this.selectedBox.x + this.jumpConstant,
              this.limit.x + this.limit.width - this.selectedBox.width - 2
            );

          if (['Delete'].includes(event.key))
            this.boxes = this.boxes.filter((b) => b.id != this.selectedBox.id);
        } else {
          console.log('No box is selected');
        }
      };
      this.keyboardListening = true;
    }
  }
}
