/* 
* The Parade
* description: A simple JS popup
* version: 1.0.0
* date: 2016-10-14
* url: fb.me/mieertha
* Copyright 2016 Azim Curt;
*/

;(function(global,w,d,undefined){
	
	w.Parade = function App(options){
		if (!(this instanceof App)) {
			return new App(options);
		}
		w.event = options.eventStop || w.event;
		event.preventDefault(); 
		var self = this;
		self.default = {
			status: false,
			eventStop: false,
			html: false,
			build: {},
			items: false,
			gallery: false,
			imageSrc: false,
			imageTitle: false,
			closeCover: true,
			closeBtn: true,
			closeBtnFix: false, // Position of Close button
			closeDelay: 300, // if using CSS-animations
			closeBtnText: "&times;",
			closeBtnTitle: "[ESC] to close",
			loadingText: "Loading...",
			customClass: ''
		};
		self.options = self.default;
		if (typeof options === "object") {
			for (option in options) {
				if (self.options.hasOwnProperty(option)) {
					self.options[option] = options[option];
				}
			}
		}
		
		if(self.init()){
			self.options.status = self.open();
			self.events();
		} 
	};
	
	/* initialization */
	Parade.prototype.init = function(){ 
		if(d.querySelector('.prd-container')){	
			d.body.removeChild( d.querySelector('.prd-container') );
		}
		if( this.options.gallery !== false){
			var itemsSelector = this.options.items || "a";
			var itemActive = false;
			var itemsColl = this.options.gallery.querySelectorAll(itemsSelector);
			this.options.items = [];
			for(var i = 0, len = itemsColl.length; i < len; i++ ){
				var itemObj = {
					item: itemsColl[i],
					active: false
				}; 
				if( this.closest(event.target,itemsColl[i]) ){
					itemObj.active = true;
					itemActive = i;
				}
				this.options.items.push(itemObj);
			}
			if( itemActive === false ) { 
				return false;
			} 
		}
		var container = document.createElement('div'),
			outer = document.createElement('div'),
			box = document.createElement('div'),
			inner = document.createElement('div'),
			close = document.createElement('button'),
			content = document.createElement('div');
		
		content.setAttribute("class","prd-content");
		close.setAttribute("class","prd-close");
		close.setAttribute("title",this.options.closeBtnTitle);
		inner.setAttribute("class","prd-inner");
		box.setAttribute("class","prd-box");
		outer.setAttribute("class","prd-outer");
		container.setAttribute("class","prd-container "+this.options.customClass);
		
		container.appendChild(outer);
		outer.appendChild(box);
		box.appendChild(inner);
		if( this.options.closeBtnFix === true && this.options.closeBtn ) {
			outer.appendChild(close);
		} else if (this.options.closeBtn) {
			inner.appendChild(close);
		}
		inner.appendChild(content);
		
		close.innerHTML = this.options.closeBtnText;
		
		d.body.insertBefore( container, d.body.firstChild );
		
		this.options.build = {
			container : container,
			outer : outer,
			box : box,
			inner : inner,
			close : close,
			content : content
		};
		
		if(this.options.imageSrc !== false && this.options.html === false && this.options.gallery === false){
			this.showImage(this.options.imageSrc, this.options.imageTitle); 
		}
		
		if(this.options.html !== false){
			this.html( this.options.html );
		}
		if( this.options.gallery !== false){
			this.options.build.content.classList.add('prd-gallery-content');
			this.galleryBuildCtrl(itemActive);
		}
		return true;
		
	};
	
	/* Method: add class to tag body */
	Parade.prototype.bodyAction = function(mode){
		var wWidth = w.innerWidth
			|| d.documentElement.clientWidth
			|| d.body.clientWidth;
		var scrollWidth = wWidth - this.options.build.container.clientWidth;
		if(mode === 'open'){
			d.documentElement.classList.add('prd-body');
			d.documentElement.style.marginRight = scrollWidth+'px';
		}else if(mode === 'close'){
			d.documentElement.classList.remove('prd-body');
			d.documentElement.style.marginRight = '0px';
		}
	};

	/* Method: create tag Img */
	Parade.prototype.showImage = function(src,title){
		var self = this;
		this.html('<span class="prd-loading">'+this.options.loadingText+'</span>');
		var img = d.createElement("img");
		img.setAttribute("src", src );
		img.onload = function(){
			img.style.display = "block";
			img.style.maxWidth = "100%"; 
			self.options.build.box.setAttribute("class","prd-box prd-image");
			self.html("");
			self.options.build.content.appendChild(img);
			if ((typeof title === 'string') && title != "") {
				self.options.build.content.innerHTML += '<div class="prd-image-title">'+title+'</div>';
				img.alt = title;
			}
		}; 
	};
	
	/* Method: build gallery ctrl */
	Parade.prototype.galleryBuildCtrl = function(index){
		if(this.options.imageSrc) {
			var imgSrc = this.options.items[index].item.getAttribute( this.options.imageSrc );
			if(this.options.imageTitle){
				var imgTitle = this.options.items[index].item.getAttribute( this.options.imageTitle );
			}else{
				var imgTitle = this.options.items[index].item.getAttribute( "title" );
			}
			this.showImage(imgSrc , imgTitle);
		}else{
			this.showImage(this.options.items[index].item.href,this.options.items[index].item.title);
		}
		var prev = d.createElement('button'),
			next = d.createElement('button');
		prev.innerHTML = "←";
		next.innerHTML = "→";
		prev.title = "[←] to previous";
		next.title = "[→] to next";
		prev.className = "prd-prev";
		next.className = "prd-next";
		this.options.ctrl = {};
		this.options.ctrl.index = index;
		this.options.ctrl.prev = prev;
		this.options.ctrl.next = next;
		
		this.options.build.outer.appendChild(prev);
		this.options.build.outer.appendChild(next);
		
	};
	Parade.prototype.galleryCtrl = function(mode){
		var self = this;
		var changeVal = false;
		if(mode === 'prev' && self.options.ctrl.index > 0){
			self.options.ctrl.index = self.options.ctrl.index - 1;
			changeVal = true;
		}else if(mode === 'next' && self.options.ctrl.index < self.options.items.length-1){
			self.options.ctrl.index = self.options.ctrl.index + 1;
			changeVal = true;
		}
		if (changeVal){
			if(self.options.imageSrc) {
				var imgSrc = self.options.items[self.options.ctrl.index].item.getAttribute( self.options.imageSrc );
				if(self.options.imageTitle){
					var imgTitle = self.options.items[self.options.ctrl.index].item.getAttribute( self.options.imageTitle );
				}else{
					var imgTitle = self.options.items[self.options.ctrl.index].item.getAttribute( "title" );
				}
				self.showImage(imgSrc , imgTitle);
			}else{
				self.showImage(self.options.items[self.options.ctrl.index].item.href,self.options.items[self.options.ctrl.index].item.title);
			}
		}
	};
	
	/* Method: open The Parade */
	Parade.prototype.open = function(){
		this.bodyAction('open');
		this.options.build.container.classList.add("prd-active");
		return true;
	};
	
	/* Method: close The Parade */
	Parade.prototype.close = function(){
		var self = this;
		self.options.build.container.classList.remove("prd-active");
		setTimeout(function(){
			self.bodyAction('close');
			d.body.removeChild(self.options.build.container);
			self.options.status = false;
		},self.options.closeDelay);
	};
	
	/* Method: insert HTML */
	Parade.prototype.html = function(dataHTML){
		this.options.build.content.innerHTML = dataHTML;
	};
	
	/* Method: closest */
	Parade.prototype.closest = function (el, parent) {
		while (el) {
			if (el === parent) return true; 
			el = el.parentNode;
		}
	}
	
	/* Events */
	Parade.prototype.events = function(){
		var self = this;
		self.options.build.close.addEventListener('click',function(e){
			if( self.options.closeBtnFix === false ){
				self.close();
			}
		},false);
		self.options.build.container.addEventListener('click',function(e){
			var closeActive = false;
			if(!self.closest(e.target , self.options.build.inner) && self.options.closeCover ){
				 if( (typeof self.options.ctrl === 'object') && self.closest(e.target ,self.options.ctrl.prev) ) {
					 self.galleryCtrl('prev');
				 }else if( (typeof self.options.ctrl === 'object') && self.closest(e.target ,self.options.ctrl.next) ){
					 self.galleryCtrl('next');
				 }else{
					closeActive = true;
				 }
			} else if( (typeof self.options.ctrl === 'object') && self.closest(e.target ,self.options.build.content) ){
				self.galleryCtrl('next');
			}
			if(closeActive){
				self.close();
			}
		 
		},false);
		d.onkeydown = function(evt) {
			evt = evt || w.event;
			var isEscape = false;
			if ("key" in evt) {
				isEscape = (evt.key == "Escape" || evt.key == "Esc");
			} else {
				isEscape = (evt.keyCode == 27);
			}
			if (isEscape && self.options.status && self.options.closeCover) {
				self.close();
			} 
			if (self.options.gallery !== false && evt.keyCode == 37 ) {
				self.galleryCtrl('prev');
			}else if (self.options.gallery !== false && evt.keyCode == 39 ) {
				self.galleryCtrl('next');
			}
		};
	};

}(this,window,window.document));