(function(){ // Tworzymy anonimową funkcję
	var section=function(){ // Tworzymy klasę section
		engine.model.tool.call(this); // Dziedziczymy model tool
		this.type="section"; // Ustalamy typ znacznika html
		this.class="frame"; // Nadajemy klasy css
		this.editable=false; // Wyłączamy możliwość edycji tekstu
	}
	var div=function(){
		engine.model.tool.call(this);
		this.type="div";
		this.class="test";
		this.editable=false;
		this.container=true; // Włączamy możliwość dodawania innych modułów do tego kontenera
	}

	var span=function(){
		engine.model.tool.call(this);
		this.type="span";
		this.class="special-text";
		this.editable=true; // Włączamy możliwość edycji tekstu
		this.container=false;
		this.draggable=true; // Włączamy możliwość przenoszenia modułu do innego kontenera drag and dropem
		this.textOptions=false; // Wyłączamy możliwość dodawania narzędzi do edycji tekstu i możliwość wklejania tekstów z stylami
		this.placeholder="Sample text..." // Placeholder jak w inputach
		this.text="Sample text test in span" // Span wygeneruje ten tekst na początku, jeżeli this.editable jest włączone tekst będzie można zmieniać z poziomu edytora, text może zawierać znaczniki HTML
	}

	var tool=function(){
		var container=new section(); // Przypisujemy klase section do zmiennej obj
		var obj=new div();
		obj.content.push(new span()); // Wrzucamy span do div'a
		
		container.content.push(obj); // Na koniec wrzucamy do section, div'a z znacznikiem span

		/* Instrukcje powyżej powinny stworzyć nam taką strukturę:
			<section class="frame">
				<div class="test">
					<span class="special-text">
						Sample text test in span
					</span>
				</div>
			</section> 
		*/
		
		engine.add.object(container); // Dodaje do edytora objekt container
	}

	/* Ta funkcja stworzy nam przycisk w narzędziach edytora:
		engine.tools.add( "Ikona font awesome" ,"Nazwa modułu/wtyczki", Nazwa_funkcji_która_ma_się_wykonać_po_kliknięciu_w_ikonę_wtyczki );
	*/
	engine.tools.add("fal fa-table","Nazwa modułu",tool);
})();


/* Domyślne wartości engine.model.tool które dziedziczymy:

	this.type="h1";
	this.class="";
	this.text="";
	this.src="";
	this.placeholder="";
	this.content=[];
	this.editable=true;
	this.container=false;
	this.textOptions=false;
	this.spellcheck=false;
	this.draggable=false;
	this.alt=null;


*/