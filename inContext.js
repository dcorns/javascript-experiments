/**
 * inContext
 * Created by dcorns on 8/23/15.
 * Copyright © 2015 Dale Corns
 * Examples of various ways to manipulate or access different contexts in JavaScript
 * Important to note that all of this is done in 'strict mode' which changes the way 'this' is evaluated. Without strict mode (bad idea) other results would be observed.
 */
'use strict';
//global scope

//Basic context follows with everyone in the global context but with each scope isolated from the global scope:
console.log('Basic Context');
var a = 0;

function f1(){
  //f1 scope
  var a = 1;
  return a;
}

function f2(){
  //f2 scope
  var a = 2;
  return a;
}

function f3(){
  //f3 scope
  var a = 3;
 return a;
}

console.log('global : ' + a);
console.log('f1 : ' + f1());
console.log('f2 : ' + f2());
console.log('f3 : ' + f3());

//Experimenting with the key word 'this'
console.log('Experimenting with the key word \'this\'');
function f4(ctx){//this function expect to receive 'this' with a property 'a'
  return ctx.a;
}
function f5(){
  a = 5;
  console.dir(this);
  return this;
}

var b = f4(this); //global context (window object)(window.a)
console.log('b : ' + b);

//b = f4(f5());
//console.log('b : ' + b);
// function f5 sends its context, but f4 returns undefined. This is because f5's this is undefined. 'this' the value of this is not an object inside of f5, without the use of strict mode ('use strict' on line 7) f5's this would have defaulted to the global scope (window) As would all the functions thus far. 'use strict' can also be confined to the beginning of a function but putting it at the beginning of the scripts applies it to all the functions which is a good thing.
function f6(){
  {a: 6}
  return this;
}

//b=f4(f6());
//console.log('b : ' + b);
//f6 will not work either because simply putting an object inside a function will not automatically be 'this'

function f7(){
  var x = {a: 7};
  return this;
}

//b=f4(f7());
//console.log('b : ' + b);
//and neither will f7 because while the function contains an object, it is not itself an object

function f8(){
 // this = {a: 8};
  return this;
}
//b=f4(f8());
//console.log('b : ' + b);
//and f8 does not work because even though we tried to make this an object, we are trying to change the whole global scope here and strict mode (fortunately) will not allow it. Trying it by defining it with a var keyword will not work either but we will skip that demonstration. It is easy enough to add it if you want to see for yourself

function f9(){
  this.a = 9;
  console.dir(this);
  return this;
}

//b=f4(f9());
//console.log('b : ' + b);
//nope, f9 will not work either because here, 'this' is undefined. At this point we have run out of options and 'this' was never meant to be this way anyhow. Its pointless. In all these failed cases we would want to return a variable that we declare instead of this anyway.

function f10(){
  var obj = {a: 10};
  return obj;
}
b=f4(f10());
console.log('b : ' + b);

//no surprise to see that f10 works so what is 'this' good for anyway? Well first lets define what 'this' is. 'this' is a keyword that points to the object to which a function belongs. So you might say that all these functions belong to the global object (window) so this should refer to window object. And it does, however, we are using 'use strict' and now it should be clear that 'use strict' keeps the global object from leaking its context into the functions that we create. And that is a good thing because we want 'this' to refer to our own objects in order to use it.

//so
b=f4(f10());
console.log('b : ' + b);

//is equivalent to

b=window.f4(window.f10());
console.log('b : ' + b);

//equivalent to:

b=this.f4(this.f10());
console.log('b : ' + b);

//It should be clear at this point, that scope and context are not the same thing in JavaScript. Scope refers to the inside of a function while context refers to the inside of an object

//Lets demonstrate the use of this in making a constructor
function Car(make, model, horn){
  console.log(this);
  this.make = make;
  this.model = model;
  this.horn = horn;
  this.honk = function(){
    console.log(this.horn);
  };
  console.log(this);
}

//Well there are a lot of this keywords in that constructor so to what do they refer? Well you may have guess when running the code that 'this' refers to each object that is created using the car object constructor, but why isn't the this referred to on line 124 undefined as with our other functions. Or even more astounding is that line 118 logs an empty object. The reason is because context is more specifically defined as the execution context. When we use are car constructor, we are not simply calling it like our other functions. We are using the operator new to call it. Our constructor function is actually just a definition for the object we create using the new operator. And so it is because new is used that the execution context reffers to the object we are creating with new. After the object is created 'this' will still refer to it, because everything gets placed inside of the object that we made. If we tried to run Car without the new operator, we would experience the same problems as before ('this' would be undefined)

var car1 = new Car('Ford', 'Bronco', 'honk honk');
car1.honk();

//If we make another object, it to will become the context for all the methods and properties in it. Each new Car object created by the constructor and new become a new object with their own this context. This alone should demonstrate the great power of 'this'.

var car2 = new Car('Volkswagen', 'Beetle', 'beep beep');
car2.honk();

// We could make a constructor without using 'this'.

var Dog = function(){
  return {breed: '',
    name: '',
    bark: function(){
      console.log('My name is ' + name);
    }
  }
};

var tex = new Dog();

tex.breed = 'Mastif'; tex.name = 'tex';

console.dir(tex);
tex.bark();

//however as you can see extra steps must be taken to assign our property values. Furthermore you can not add a function that refers to the constructor properties without using 'this'. In the this example 'name' will refer to whatever object context shows up first to claim it.

//using 'call and apply'
console.log('Using call and apply');

//call or apply allows us to send a context to a function to use when we invoke it.
//Lets demonstrate this with our function f8 which does not currently work.
//First we will change our window.a property to 8 and then execute the function within the context of the window object
//We demonstrate with call, but apply is used exactly the same. The difference between the two is how the arguments are passed to the modified function. Call uses additional comma separated values following the context object. Apply uses a comma and then an array containing the arguments to be passed.
a = 8;
b = f4(f8.call(this));
console.log('b : ' + b);

//We could also add an 'a' property to our dog tex and use it for the context

tex.a = 20;
b = f4(f8.call(tex));
console.log('b : ' + b);

//bind

console.log('using bind');
//bind is a powerfull fun method added in Ecma5 it creates a new function identical to the one it is invoked on and the new functionuses the context passed to it permanently regardless of the actual context it is in.

var bindexample = f8.bind({a: 8});
b = f4(bindexample());
console.log('b : ' + b);

tex.texbind = bindexample;

b = f4(tex.texbind());
console.log('b : ' + b);

tex.honk = car1.honk.bind(car1);
tex.honk();
console.dir(tex);

//even though the honk function refers to 'this.horn' which is undefined in tex, it still works because it is bound to car1. we can even add it to window.

var honk = car1.honk.bind(car1);
honk();

//note also that if we put our own horn property on honk, it will still use the horn from car1

honk.horn = 'awooga awoooooooga';
honk();

//That about does it for context