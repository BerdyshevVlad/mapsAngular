import { Component,OnInit } from '@angular/core';
import { of,from,forkJoin  } from 'rxjs'; 
import { map, delay,mergeMap,mergeAll,switchMap,switchAll,concatMap,flatMap,tap } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit  {
  name = 'Angular';
  public propOne: string;
  public propTwo: string;
  public propThree: string;
  public propFour: string;

  constructor(){
     console.log('constr');
  }

  ngOnInit(){
    console.log('ngOnInit');
    this.someMethod();

    //test maps
    this.mapMethod();
    this.mergeMapMethod();
    this.switchMapMethod();
    this.concatMapMethod();
  }

serviceOne(num:number){
  
  return of(`retrieved new data with param ${num} from service one`).pipe(
    delay(1000)
  )
}

serviceTwo(num:any){
  
  return of(num).pipe(
    delay(1000)
  )
}

serviceForConcatToSeeOrder(param){
  const delayTime = Math.floor(Math.random() * 10000) + 1;
  return of(`retrieved new data with params: ${param} and delay: ${delayTime}`).pipe(
    delay(delayTime)
  )
}

mapMethod(){
  // using a regular map
from([1,2,3,4]).pipe(
  map(param => this.serviceOne(param))
  //or 
  //map(param => this.serviceForConcatToSeeOrder(param))
).subscribe(val => val.subscribe(data => console.log(data)));
}

mergeMapMethod(){
// using map and mergeAll
from([1,2,3,4]).pipe(
  map(param => this.serviceOne(param)),
  //or 
  //map(param => this.serviceForConcatToSeeOrder(param))
  mergeAll()
).subscribe(val => console.log(val));

// using mergeMap
from([1,2,3,4]).pipe(
  mergeMap(param => this.serviceOne(param))
  //or 
  //mergeMap(param => this.serviceForConcatToSeeOrder(param))
).subscribe(val => console.log(val));
}

switchMapMethod(){
  // using map and switchAll
from([1,2,3,4]).pipe(
  map(param => this.serviceOne(param)),
  //or 
  //switchMap(param => this.serviceForConcatToSeeOrder(param))
  switchAll()
).subscribe(val => console.log(val));

// using switchMap
from([1,2,3,4]).pipe(
  switchMap(param => this.serviceOne(param))
  //or 
  //switchMap(param => this.serviceForConcatToSeeOrder(param))
).subscribe(val => console.log(val));
}

concatMapMethod(){
  // using concatMap
from([1, 2, 3 ,4]).pipe(
  concatMap(param => this.serviceOne(param))
  //or 
  //concatMap(param => this.serviceForConcatToSeeOrder(param))
).subscribe(val => console.log('concatMap:', val));
}

someMethod(){
forkJoin(this.serviceOne(1),this.serviceOne(2),this.serviceOne(3))
.pipe(
      tap(([res1, res2, res3]) => {
        this.propOne = res1;
        this.propTwo = res2;
        this.propThree = res3;
      }),
      mergeMap(result => this.serviceTwo(result))
    )
    .subscribe(res4 => {
      this.propFour = res4;
      console.log(this.propFour);
    });
}

}
