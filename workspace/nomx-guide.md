# Nomx
A guide on using Nomx and proper design patterns. An upgrade to Nom that is more organized, full typescript + react support, and special methods.

# Creating basic UI
Every element in Nomx is its own object, complete with methods and properties. To create an element, we specify the element name, the properties, and the children.
```js
const element = Nomx.create("container", {backgroundColor: "red"}, ["Hello World"])
```
Only the element name is required, if no property/children is specified, it will default to an empty object/array.
```js
const button = Nomx.create("button")
```

## Creating UI With JSX
When using cdo-sync + typescript, it is possible to write your elements using html tags.
```tsx
const element = <div backgroundColor="red">Hello World</div>
const button = <button/>
```
Unfortunately, due to JSX being made for React, elements defined using it will have the type 'DestructibleElement' by default. This could work for just checking the id or adding children, but having element-specific properties such as onClick would lead to a type error. To mitigate this, you can add a type assertion to jsx elements.
```tsx
const button1 = <button/>
button1.onClick = ()=>{} //Property 'onClick' does not exist on type 'DestructibleElement'

const button2 = <button/> as Nomx.Button
button2.onClick = ()=>{} //all good
```

# Interacting with Elements
Like most object oriented systems, Nomx elements have **methods** and **properties**. Methods are functions that can be called, and properties are variables that can be changed. Consider the following code:
```tsx
const button = <button/> as Nomx.Button;
button.x = 50;
button.setStyle("border: solid;")
```
In this example, button.x is a property and button.setStyle() is a method.

In most cases, every Element will have a parent, an id, children, text or both.
```tsx
button.parent = screen1; //change parent
console.log(button.id) // "Nomx_Gen_1"
button.addChildren(<span>hello</span>) //add a child
button.text = "bruh" //overwrites "hello"
button.delete(); //delete an element
button.on("mouseover", ()=>{ //add events
    console.log("mouse over")
})
```

Different Elements will have different properties and methods, so it's best to use typescript for autofills.


# Custom Elements
The beauty of Nom/Nomx is its ability to create special reuseable components to make programming dynamic UI easier.
```tsx
class Chat extends Nomx.Container {
    sendMessage(user: string, message: string){
        this.addChildren(<div>{`[${user}]: ${message}`}</div>)
    }
}

const ChatContainer = <Chat/>;
ChatContainer.sendMessage("User1", "Hi guys!")
```
If you are unable to do `class extends`, you can do
```js
var Chat = Nomx.extendClass(Nomx.Container, function(isNew, id, children){}, {
    //prop: {get: function(){return value}, set: function(value){}}
}, {sendMessage: function(user, message){
    this.addChildren(Nomx.create("container", {}, "["+user+"]: "+message))
}})
var ChatContainer = Nomx.create(Chat);
ChatContainer.sendMessage("User1", "Hi guys!")
```

There are some element types in Nomx that are not native to Applab for convenience.
* Nomx.RippleButton: More or less the same as a normal button, except it creates an ink effect when you click on it.
* Nomx.Screen: While it does exist in Applab, it is not something that can be normally created, however this is possible in Nomx just by doing `Nomx.create("screen")`
* Nomx.Root: "divApplab" is the element to which all other elements in Applab are a descendant of. Below is a basic structure of Applab's internal html.
    ```html
    <!--Nomx.Root-->
    <div id = "divApplab">
        <!--Nomx.Screen-->
        <div id = "screen1" class="screen">
            <!--Nomx.Button (indiscernable from RippleButton)-->
            <button id="button1">Click Me</button>
        </div>
    </div>
    ```

# Integrating with pre-existing UI.
Applab has a feature called design mode which allows the user to create screens and buttons with their own ids. Suppose you have a button called "button1" and a text input called "input1" in your design mode. You can access this as a Nomx element in your code by doing `$$ELEMENTID`

Do keep in mind that elements that don't match this regex `/^([a-zA-Z0-9\_\-]+)(?:\#([a-zA-Z0-9_\$]+))?$/` will automatically be ignored.
```tsx
$$button1.onClick = ()=>{
    console.log("hi")
}
```

# Special Nomx-only functions/methods.
By using clever getAttribute and a built-in html parser, Nomx has access to useful "functions" that are normally inaccessible in Applab.
* element.children: Children of an element.
* element.style: Inline style of an element
* element.outerHTML, element.innerHTML, element.childElementCount, element.scrollHeight: Obtained using getAttribute()
* element.scrollTop (set + get)
* Nomx.baseURI, Nomx.channelId
* Nomx.root.activeScreen

# Converting from Applab to Nomx.
Applab has a terrible programming paradigm, and these are some common coding "templates" and how to do (professionally) it in Nomx.

**Note**: Since Applab uses id strings, while Nomx uses object, id-object equivalents will be represented as $$id, basically the predefined elements.

## setScreen(screenId)
```js
$$screenId.set();
```

## setText(id, text) / var txt = getText(id)
```js
$$id.text = text;
var txt = $$id.text
```

## onEvent(buttonid, "click", callback)
```js
$$buttonid.onClick = callback //changing onClick will overwrite the previous callback
//OR
$$buttonid.on("click", callback)
```

## button(id), container(id), input(id)
```tsx
var button = Nomx.create("button")
var container = Nomx.create("container")
var input = Nomx.create("input")
//OR
var button = <button/> as Nomx.Button;
var container = <div/> as Nomx.Container;
var input = <input/> as Nomx.Input;
```

## setParent(id, parentid)
```tsx
$$id.parent = $$parentid
```

## setProperty(id, "prop-name", value), var prop = getProperty(id, "prop-name")
```tsx
$$id.propName = value;
var prop = $$id.propName
```

# Why Should I use Nomx?
Applab has a procedural programming pattern which is terrible as no high level abstract programming language/library uses procedural methods. The only real languages that use procedural programming is Assembly, which is obvious as it's for low level, optimized programming, and C, which is also low level and infrequently used as C++, *C with objects*, is preferred.

Nomx is in many cases both shorter and more intuitive, even if there is an extra layer of processing as Nomx calls Applab's procedural methods internally.