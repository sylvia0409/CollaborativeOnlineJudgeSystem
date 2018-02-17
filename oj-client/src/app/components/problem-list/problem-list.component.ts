import { Component, OnInit, Inject } from '@angular/core';
import { Problem } from '../../models/problem.model';


@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {
  problems: Problem[];

  constructor(@Inject('dataService') private dataService) { }

  ngOnInit() {
    this.problems = this.dataService.getProblems();
  }

}
