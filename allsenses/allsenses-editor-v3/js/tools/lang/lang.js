(function(){
	window.lang={
		is:location.href.split("/admin/")[1].split("/editor")[0].split("/")[1],
		data:{},
		translate:function(str){
			if(lang.data[lang.is]){
				if(lang.data[lang.is][str]){
					return lang.data[lang.is][str];
				}else{
					//if(str==undefined){console.log(str)};
					lang.noData[str]="brak tłumaczenia";
					return str;
				}
			}else{
				return str;
			}
		},
		noData:{}
	}

	


	lang.data["pl"]={
		"Section": "Sekcja",
		"Basic": "Podstawowe",
		"Grid": "Siatka",
		"Heading": "Nagłówek",
		"Text": "Tekst",
		"Line": "Linia",
		"YouTube": "YouTube",
		"Extra": "Dodatkowe",
		"Image": "Zdjęcie",
		"Icon": "Ikona",
		"Link": "Link",
		"Shortcode": "Krótki kod",
		"Slider": "Slider",
		"Gallery":"Galeria",
		"Example": "Przykład",
		"Super small": "Super mały",
		"Very small": "Bardzo mały",
		"Small": "Mały",
		"Medium": "Średni",
		"Large": "Duży",
		"Align:": "Wyrównanie:",
		"Left": "Lewo",
		"Center": "Środek",
		"Right": "Prawo",
		"Auto": "Auto",
		"Heading:":"Nagłówek:",
		"Fluid:": "Rozciągnij:",
		"Size 1": "Rozmiar 1",
		"Size 2": "Rozmiar 2",
		"Size 3": "Rozmiar 3",
		"Size 4": "Rozmiar 4",
		"Size 5": "Rozmiar 5",
		"None":"Brak",
		"Loop:": "Pętla:",
		"Yes": "Tak",
		"No": "Nie",
		"Autoplay:": "Auto odtwarzanie:",
		"Animate out:": "Efekt:",
		"Fade": "Znikanie",
		"Slide": "Przesunięcie",
		"Autoplay speed:": "Prędkość animacji:",
		"Margin:": "Margines:",
		"Navigation:": "Nawigacja:",
		"Dots:": "Kropki:",
		"Center:": "Wyśrodkowanie:",
		"Items:": "Slajdy do pokazania:",
		"Icon selection": "Wybierz ikonę",
		"Grid type":"Typ siatki",
		"Youtube video address": "Podaj adres URL filmu z YouTube",
		"Example popup": "Przykładowe okno",
		"Select image": "Wybierz zdjęcie",
		"Click to upload images...": "Kliknij aby dodać zdjęcie...",
		"Small size:": "Wielkość na small",
		"Medium size:": "Wielkość na medium",
		"Large size:": "Wielkość na large",
		"Small order:": "Kolejność na small",
		"Medium order:": "Kolejność na medium",
		"Large order:": "Kolejność na large",
		"Text color:": "Kolor tekstu",
		"Animation on scroll": "Animacja na przewijaniu",
		"Animation type:":"Typ animacji:",
		"Easing:":"Znikanie:",
		"Delay:":"Opóźnienie:",
		"Duration:":"Czas trwania:",
		"Saving page":"Zapisywanie strony",
		"You made no changes":"Nie dokonałeś żadnych zmian",
		"Page saved":"Strona zapisana",
		"Publishing page":"Publikowanie strony",
		"Page saved & published":"Strona zapisana i opublikowana",
		"Class manager": "Menedżer klas",
		"Class added successfully": "Pomyślnie dodano klasę",
		"The class was successfully deleted": "Pomyślnie usunięto klasę",
		"This class is reserved": "Klasa jest zarezerwowana",
		"Vertical align:": "Wyrównanie w pionie:",
		"Top": "Góra",
		"Middle": "Środek",
		"Bottom": "Dół",
		"Undo": "Cofnięto",
		"Redo": "Przywrócono",
		"Preview": "Podgląd",
		"Tooltip on hover":"Podpowiedź po najechaniu myszką",
		"Position:":"Pozycja",
		"Title:":"Tytuł",
		"Arrow position:":"Pozycja strzałki",
	};
})();