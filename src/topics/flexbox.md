---
title: Using Flexbox
---

# {{ page.title }}


> This is quite nonsensical, need to rewrite and organize the whole thing.

<https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox> describes it quite nicely
just provide enough intro here so that by reading mdn page its easy to understand.

## Div with elements
Most elements in HTML have either a `display` of `block` or `inline`. 
By default
`block` elements take up the entire width of the screen. This results in
elements being forced to the next line. `inline` makes them behave like text,
put them in the same line.

When we apply display `flex` we leave this system behind and enter a new world
where things work differently.

The most important Concept in `flexbox` are the axes along which items are
positioned the *main axis* and the *cross axis*. They control the flow of our
flexbox layout to position your elements you have to keep in mind both of these
axes.

## Positioning Horizontally
To position your elements anywhere along the main axis you need the justify
content property this property has three basic values `Flex start` is at the
start of the main axis this is the default value which is why our boxes are here
at the left side of our screen. `Flex end` is at the end of the main axis this
will align the boxes on the right side and `Center` is at the center of the main
axis so you can use these two lines of code display flex and justify content
Center to Center your elements horizontally.

## Positioning Vertically
Now let's see how we can align elements vertically. in this case we need to
consider the cross axis to do this let's increase the size of the flexbox layout
by applying a Min height of 800 pixels in the body now we can see that this
black border is basically the frame of our flexbox layout to Center your
elements on the cross axis we use the Align items property this property can
have the same values as justify content so you have Flex start for top
positioning meaning at the start of the Cross axis X end for bottom positioning
now they are down here and of course Center to put them in the center

## How to Center a div
how to center a div you just need these three lines of code to Center elements
along the main and cross axis since flexbox is flexible this layout will work
even if we change the size of the layout the boxes will always be in the center
no matter if we change the height and width of the body.

## Justify and align
justify content and align items can have three additional and more complex
values space between space around and space evenly space between will distribute
the elements from left to right the first and last element will touch the edge
of the layout depending on how big the container is the elements will have a
bigger Gap in between space around Works similarly but here the first and last
element do not touch the edge instead every element gets some space to the left
and right as you can see even when I resize the entire website the spacing
between the elements adjusts automatically but here we run into a slight
inconsistency that the right space of the Box adds up with the left space of the
second box it will result in these spaces being twice as big as the spaces that
we have to the edges if you don't want that you can use space evenly here all
the spaces are the same size and now finally the gaps are perfectly balanced as
all things should be and of course all of these values are completely flexible
they adjust perfectly when the size of the container changes and that's the
whole point of using Flex box theoretically you could achieve the same thing
centering a div and positioning your elements using only margins and padding but
they are just not as flexible as a flexbox layout by the way you can use the
same values on the Align items property as well but in this case it wouldn't
make sense since we only have one row of content the boxes will all just be at
the start of the Cross AIS but it is possible to use these values on the cross
axis as you will learn later once the layouts get more complex for now let's
learn about another interesting flexbox property which is flex direction to
understand it easier let's remove align items and just use justify content Flex
start for now Flex Direction the flex Direction property controls the direction
of the main axis its default value is row which makes the main axis go from left
to right you could also use row reverse to make it go from right to left looking
at the numbers we can see that it starts counting from the right but this
property also changed the way our justifi content value works now as the main
axis goes from right to left the value Flex start is on the right side and flex
end is on the left side you can also make the main axis go from top to bottom by
applying Flex Direction column now the elements are no longer side by side but
instead on top of each other since the direction of the main axis changed the
direction of the Cross ax has changed as well now if you want to Center these
boxes horizontally you no longer use Justified content but instead align items
since justify content aligns the elements on the main axis which goes from top
to bottom it doesn't make sense now to use it we need to use align items Center
to Center them on the cross axis so I hope you understand that it is really
important to remember the flex direction of your layout as this completely
changes the way all the other properties work per default flexbox uses a Flex
Direction row this will align the elements side by side but you're also going to
want to change it to flex Direction column when you want your elements to be
aligned vertically here is a very common use case scenario you want your entire
website to stay the same everything is aligned vertically but you also want to
Center everything horizontally then you would go to the body and apply display
Flex Flex Direction column and and align items Center and with that every
element will automatically be centered horizontally all right let's get back to
Other Flexbox Properties our starting point display Flex there are a few more
simple flexbox properties before it gets complicated the Gap property will
create a gap between our items this property is very simple and you no longer
need to use margins inside a flexbox layout for example let's give our boxes a
gap of 20 pixels and as we can see now every box has a nice little Gap in
between the flex wrap property can make your flexbox layout responsive using
only one line of code you either have wrap or no wrap if you use flex wrap you
will get a responsive layout that will align your items on the next line if we
don't have enough space resizing the window will show how the elements flow to
the next line when necessary if you use flex wrap no wrap that will not happen
and instead the boxes will shrink together using a flex wrap of wrap will make
the elements flow to the next line if we want this layout to be centered using
justify content Center and align item Center we end up with this layout while
the gap between the first line and the second line is so big will become clear
once we have a few more boxes so let's say we have nine boxes in HTML just add a
few boxes and number them properly then the flex box layout will have more line
braks when when we use flx wrap the issue that we are running into is that we no
longer have one main axis and one cross axis but every line has its own Main and
cross axis in this case we have three of them the Align items property will only
control the alignment along each individual cross axis Flex start puts the boxes
at the start of each cross axis Flex end at the end and Center in the center but
now we also need another CSS property to control the alignment of all the lines
together for that we use align content align content has a default value of
space around and this is why the gaps between the lines are so big we can also
apply space between or space evenly to change that and of course we can also use
the basic values Flex start Flex end and Center so the difference between align
content and align items is align items will control the alignment along the
cross axis of every flexbox line individually and align content will control the
alignment of all lines together ultimately the perfectly centered layout in
flexbox is when you Center all three of these properties and wrap the elements
automatically when necessary justify content Center align item Center and align
content Center by the way when we have a layout like this where are horizontal
gaps and vertical gaps then you can actually split the Gap property into two
different properties row Gap and column Gap you can use these to apply different
values for the horizontal and vertical gaps let's say column Gap is 10 pixels
and row Gap is 20 pixels this way we applied different values for the horizontal
and vertical gaps but most likely you will not need that and just use the normal
Gap property to control both at the same time these properties are not so
important on flexbox but they will become interesting when you have more complex
layouts in Grid later in the course by now you should have a good understanding
of alignment and flexbox using these flexbox properties and their different
combinations of values you can create any alignment possibility you want and of
course if you don't know by now you can also use flexbox in every other HTML
element as well it does not have to be the body for example a little thinking
exercise for beginners if we want to Center the numbers inside the boxes which
are currently at the top left corner how would you do that how can you Center
the numbers inside the boxes pause the video and try it out yourself the answer
is pretty straightforward we do the same thing as earlier but now Inside the Box
selector display Flex to enable flexbox justify content center for the main axis
and align item center for the cross AIS and this way we centered the numbers
inside the boxes obviously you can use all the different combinations we talked
about with black star and flex and here as well now let's move on to something
very powerful in flexbox you don't always have to wrap elements in Flex box you
can also resize them responsively so our next goal is this layout where the
boxes grow and drink responsively to do that let's go back to our layout of five
boxes in HTML so remove a few boxes so that we have five boxes again in CSS we
remove any Flex box properties except display flex and gap of 10 pixels this is
as simple as it gets now since we have no flex rep applied the boxes will be
resized automatically if the viewport gets too small this Behavior can be
specified using Flex shrink and interestingly this is something that you apply
on the flex items not on the flex container inside the boxes we can apply a flex
rink of zero for example this will prevent the shrinking of the boxes they can
no longer be resized and will overflow the container this is also the case for
every non-flex box layout when you have the problem of overflowing elements like
this then consider using Flex box to either wrap the elements to with the next
line or enable flexx rink with a value of one to make them shrink automatically
but remember Flex rink of one is the default value you can imagine this property
like a switch that you can turn on and off now when we have Flex rink applied we
can see how the boxes resize automatically currently we are addressing every box
the same way using their class so every box has the same Flex rink value but you
can also use different Flex rink values on each item so in HTML I give the first
box an ID box one I want to style this one differently when I address this box
in CSS I could give this box a flex ring of zero for example and the other ones
still have a flex ring of one this will result in this Behavior every element
rings when necessary except the first one it will stay the same you could use
this intentionally if you don't want specific elements to shrink for example if
you don't want to distort an image or icon then it is pretty useful to disable
Flex ring on that element now Flex rink is pretty FlexGrow useful but actually
what I use way more often is its counterpart Flex grow Flex grow enables
elements to grow meaning to stretch along the main axis its default value is
zero so elements do not grow per default but once you enable it Flex grow one
all the flex items try to fill out the empty space inside their parent element
this means if there's more empty space the elements will be bigger they grow
Flex grow tries to fill out all the available space inside the parent element
and of course you can address specific elements and apply a different grow
behavior let's say for the boxes the flex grow is zero so they cannot grow but
box number one can grow and as you can see we end up with this effect where only
the first element will grow I used this exact behavior when I developed the
to-do application here the to-do text grows as much as possible while the
checkbox the delete button and all the other elements should not be able to grow
this is is a very useful technique to resize specific elements depending on the
screen size so you will use it very often when making a website responsive Flex
grow and flex rink are not only a Boolean that you can turn on and off but they
also work as a multiplier you can assign even higher numbers than one they only
Mak sense if they are compared with each other for example let's give the boxes
a flex grow of one and the first box a flex grow of five now every element has
the ability to grow but the first one does it five times faster this El element
will be bigger than the others but every element can potentially grow so you can
basically apply different grow values to control how much of the empty space
they should fill this does not mean that this box is five times bigger as we can
see per default they are all the same size but only when there's new empty space
to fill out then this element will Reserve five times more of that new space
than the other elements and the same thing can be done for Flex shrink now the
first box shrinks five times faster than the other and of course you can address
every element on its own and apply a different value for Flex grow and flex rank
but I never had a situation where this specific feature was being used since
most times you just want to turn on and off the grow and Shrink ability for the
elements in a balanced way where they all behave the same way this whole system
of flex grow and flex rink becomes even more powerful when you combine it with
minimum and maximum sizes such as minwidth and Max width because then you can
Define where the flex rink and flex grow should stop you can say my boxes should
be able to grow Flex grow of one but they should not become bigger than 300
pixels each Max with 300 pixels now the elements grow grow grow grow grow up to
the point where they reach the maximum size and the same for Flex Shrink Flex
shrink they can shrink but only until they reach a minimum width of let's say
100 pixels this will make them shrink in the browser as expected but once they
reach that size of 100 pixels the elements will overflow and of course
overflowing elements is something that you should avoid but sometimes your
elements should not get any smaller and need a minimum width to solve the
overflowing problem remember that earlier we talked about Flex wrap we can't
combine Flex rink and flex wrap by just using a media query normally we use flex
rink and flex wrap is disabled with no wrap but once the screen size gets too
small and the minwidth causes the element to overflow then we apply a flex wrap
of wrap and the element wraps to the next line and this is a beautiful example
of how easy it can be to make your website responsive you just use flex shrink
and once you don't want it to shrink anymore then you use a flex AlignSelf wrap
a special feature of flexbox that I don't really see that often being used is
the Align self property this property works just as align items but you use it
on the flex items that means let's say we have an align items of flex start and
for some reason we want to isolate the first box and apply something else that
is not Flex start a line self of flex end for example this will position only
the first box at Flex end and everything else stays Flex start of course Center
is also possible so you can use this property to align self one item differently
on the cross axis but unfortunately I have not found a similar flexbox property
for the main axis let's say we have a general Justified content of flex m and we
want the first item to be Flex start it's only logical to assume that the
property justify self works the same for the main axis but unfortunately it
doesn't since justify self is actually a property that you use in CSS grid as
you are going to learn later in the course if you want to achieve the desired
layout where only the first element is on the left side and every other element
is on the right then you would use the old school solution of margin right Auto
this is a very useful technique for navigation bars here you want your company
logo on the left side and everything else on the right side so just use margin
right Auto Summary now we already know a lot about CSS flexbox layouts but
before we dive into grid layouts let's summarize the key takeaways of flexbox
you can position everything anywhere inside a flex container if you consider the
main and cross axis and their properties justify content and align items you can
wrap elements to the next line using Flex wrap of wrap you can also resize
elements using Flex grow and flex rink and apply different values for each
element if that is what you want combining all of that with minimum and maximum
sizes and media queries you can already achieve most layouts that you have in
mind but if you want to create more complex layouts or you just want to simplify
your code then let me introduce CSS grid because there are actually things that
are easier in Grid and work with even fewer lines of code here is a common
situation how to Cent a div an experienced flexbox guy would say just use
display Flex justify content Center and Aline items Center and that's fine but a
grid layout guy would say hold on three lines of code I can do it in two display
grid Place content center now if you want to learn CSS Grid in flexbox in a
practical way by building Advanced projects like this learning page that uses
modern flexbox and grid sections then I strongly recommend that you get our HTML
and CSS complete course using the first link in the video description my name is
Fabian and this was coding to go the channel where you the most relevant coding
Concept in just a few minutes