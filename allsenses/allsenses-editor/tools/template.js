(function(){ // Tworzymy anonimową funkcję
	var section=function(){ // Tworzymy klasę section
		engine.model.tool.call(this); // Dziedziczymy model tool
		this.type="section"; // Ustalamy typ znacznika html
		this.class="frame"; // Nadajemy klasy css
		this.editable=false; // Wyłączamy możliwość edycji znacznika
	}
	var div=function(){ // Tworzymy klasę która będzie w obiekcie div
		engine.model.tool.call(this); // Dziedziczymy model tool
		this.type="div";
		this.class="test";
		this.editable=false; // Wyłączamy możliwość edycji cell
		this.container=true; // Włączamy możliwość dodawania innych modułów do obiektu cell
	}
	var tool=function(){
		var obj=new section(); // Przypisujemy klase section do zmiennej obj
		obj.content.push(new div()); 
		/* Wrzycamy do obj content klasę div, to stworzy nam strukturę:
			<section class="frame">
				<div class="test"></div>
			</section> 
		*/
		engine.add.object(obj); // Dodaje do edytora obj
	}

	/* Ta funkcja stworzy nam przycisk w narzędziach edytora:
		engine.tools.add( "Ikona font awesome" ,"Nazwa modułu/wtyczki", Nazwa_funkcji_która_ma_się_wykonać_po_kliknięciu_w_ikonę_wtyczki );
	*/
	engine.tools.add("table","Grid",tool);
})();


/* engine.model.tool:

this.type="h1";
this.class="klasa";
this.text="Tekst w znaczniku";
this.src="url";
this.placeholder="Jakiś tekst";
this.content=[];
this.editable=true;
this.container=false;


*/