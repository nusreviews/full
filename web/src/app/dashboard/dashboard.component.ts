import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Module } from '../module';
import { ModuleService } from '../module.service';
import { ModuleCardComponent } from '../module-card/module-card.component';

const pageSize = 20;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [
    './dashboard.component.css',
    '../../structure.css'
  ]
})

export class DashboardComponent implements OnInit {

  modules: Module[] = null;
  selectedModule: Module = null;
  page = 0;
  canScroll = true;
  searchItem = '';
  canSearch = false;

  public loading = true;

  constructor(
    private moduleService: ModuleService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    var offset = this.page * pageSize;
    this.moduleService.getModules(offset, pageSize)
      .then(modules => {
        this.modules = modules;
        this.loading = false;
      });
  }

  onSelect(module: Module): void {
    this.router.navigate(['/moduledetail', module.id]);
    this.selectedModule = module;
  }

  // Fired off for every key press and executes search
  onInputChange(value) {
    if (value == "") {
      this.clearSearch();
    } else {
      this.submit(value);
    }
  }

  // Commit a search
  submit(searchItem: string): void {
    // Validate search item
    if (searchItem.trim().toUpperCase().length > 0) {
      this.searchItem = searchItem;
      this.page = 0;
      this.canScroll = true;
    } else {
      this.searchItem = "";
      return;
    }

    // Perform search
    this.loading = true;
    this.moduleService.getModulesById(this.searchItem, false, 0, pageSize)
    .then(modules => {
      this.loading = false;
      this.modules = modules;
    })
  }

  clearSearch(): void {
    this.searchItem = "";
    this.canScroll = true;
    this.page = 0;
    var offset = this.page * pageSize;

    // Reinit modules
    this.loading = true;
    this.moduleService.getModules(offset, pageSize)
      .then(modules => {
        this.loading = false;
        this.modules = modules;
      });
  }

  onScroll(): void {
    if (this.canScroll && !this.loading) {
      this.page += 1;
      var offset = this.page * pageSize;

      // Perform subsequent fetch
      this.loading = true;
      if (this.searchItem.length > 0) {
        this.moduleService.getModulesById(this.searchItem, false, offset, pageSize)
          .then(modules => {
            this.loading = false;
            if (modules.length > 0) {
              this.modules = this.modules.concat(modules);
            } else {
              this.canScroll = false;
            }
          })
      } else {
        this.moduleService.getModules(offset, pageSize)
          .then(modules => {
            this.loading = false;
            if (modules.length > 0) {
              this.modules = this.modules.concat(modules);
            } else {
              this.canScroll = false;
            }
          });
      }
    }
  }
}