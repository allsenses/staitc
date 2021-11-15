export class Tag{
	constructor(tagName,className){
		let tag=document.createElement(tagName)
		if(className)tag.className=className;
		tag.html=function(html){
			this.innerHTML=html;
		}
		return tag;
	}
}