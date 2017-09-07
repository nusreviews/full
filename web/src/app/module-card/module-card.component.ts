import { Component, OnInit, Input, trigger, state, animate, transition, style  } from '@angular/core';
import { Module } from '../module';
import { ModuleService } from '../module.service';

@Component({
  selector: 'app-module-card',
  templateUrl: './module-card.component.html',
  styleUrls: [
    './module-card.component.css',
    '../../structure.css',
  ],
  animations: [
    trigger('enterAnimation', [
      state('in', style({transform: 'translateY(0)'})),
      transition('void => *', [
        style({transform: 'translateY(-100%)'}),
        animate(200)
      ]),
      transition('* => void', [
        animate(200, style({transform: 'translateY(-100%)'}))
      ])
    ])
]
})
export class ModuleCardComponent implements OnInit {
  
  @Input()
  module: Module = null;
  shouldShowRatingsBar = false;
  
  constructor(private moduleService: ModuleService) { }
  
  ngOnInit() {
    
  }
  
  loadModuleById(modId: string) {
    this.moduleService.getModulesById(modId, true, 0, 1)
    .then(modules => {
      if (modules.length > 0) {
        this.module = modules[0];
      }
    })
  }
  
  over() {
    this.shouldShowRatingsBar = true;
  }
  
  leave() {
    this.shouldShowRatingsBar = false;
  }
  
}
