import { engine } from "../../init.js";
import { Heading, Text, Container, Grid, Cell, Image } from "../../modules/models.js";

(function(){
	class Template extends Container{
		constructor(){
			super();
			this.content=[
				new Grid([
					new Cell([
						new Heading(),
						new Image()
					]),
					new Cell([
						new Text()
					])
				])
			];
		}
	}

	class Template2 extends Container{
		constructor(){
			super();
			this.content=[
				new Grid([
					new Cell([
						new Heading(),
						new Text()
					]),
					new Cell([
						new Image()
					])
				])
			];
		}
	}

	
	
	engine.add.tab("tools").tool("fal fa-image","Template 1",Template);
	engine.add.tab("tools").tool("fal fa-image","Template 2",Template2);
})();