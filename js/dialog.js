tinyMCEPopup.requireLangPack();

var JWVideoDialog = {
	init : function() {
		var f = document.forms[0];
		var ed = tinyMCEPopup.editor
		// Get the selected contents as text and place it in the input
		var n = ed.selection.getNode(), dom = ed.dom;
		document.getElementById('fbcontainer').innerHTML = getBrowserHTML('srcbrowser','jw_image','image','theme_advanced_image');
		if (n.nodeName == 'IMG') {
			var content = ed.selection.getContent({format:'text'}).replace('[', '');
			content= content.replace(']','');
			content = tinymce.util.JSON.parse('{' + content + '}');
			f.jw_width.value = n.width;
			f.jw_height.value = n.height;
			var re= new RegExp("^image=([^&]+)?&file=([^&]+)?&streamer=([^&]+)?&autostart=(true|false)$");
			var matches = re.exec(content['flashvars']); 
			if (matches) {
				f.jw_streamer.value = matches[3];
				f.jw_image.value= matches[1];
				f.jw_video_flv.value = matches[2];
				f.jw_source.value = content['Movie'];
				f.jw_autostart.value = matches[4];
			}
		} else {
			f.jw_source.value = tinyMCEPopup.getWindowArg('jw_source');
			f.jw_width.value = tinyMCEPopup.getWindowArg('jw_width');
			f.jw_height.value = tinyMCEPopup.getWindowArg('jw_height');
			f.jw_streamer.value = tinyMCEPopup.getWindowArg('jw_streamer');
		}
	},

	insert : function() {
		// Insert the contents from the input into the document
		var ed = tinyMCEPopup.editor;
		var args = {};
		var f = document.forms[0];
		
		args['width'] = f.jw_width.value;
		args['height'] = f.jw_height.value;
		args['player_url']= f.jw_source.value;
		args['streamer'] = f.jw_streamer.value;
		args['image_url'] = f.jw_image.value;
		args['video'] = f.jw_video_flv.value;
		if (f.jw_autostart.checked) {
			args['autostart'] = 'true';
		} else {
			args['autostart'] = 'false';
		}
		var content = this.buildObject(args);
		ed.execCommand('mceInsertRawHTML', false, content, {skip_undo : 1});
		//ed.dom.setAttribs('__mce_tmp', args);
		//ed.dom.setAttrib('__mce_tmp', 'id', '');
		ed.undoManager.add();
		tinyMCEPopup.close();
	},
	buildObject : function (args) {
		var src="";
		src+='<object id="__mce_tmp" width="'+args.width+'" height="'+args.height+'" ';
		src+=' classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">';
		src+='<param name="Movie" value="'+args.player_url+'">';
		src+='<param name="flashvars" value="image='+args.image_url+'&file='+args.video+'&streamer='+args.streamer+'&autostart='+args.autostart+'">';		
		src+="<param name='allowfullscreen' value='true'><param name='allowscriptaccess' value='always'><param name='wmode' value='transparent'> ";
		src+="<embed id='single2' name='single2' src='"+args.player_url+"' ";
		src+="width='"+args.width+"' height='"+args.height+"' bgcolor='#ffffff' allowscriptaccess='always' allowfullscreen='true' ";
		src+=" flashvars='image="+args.image_url+"&file="+args.video+"&streamer="+args.streamer+"&autostart="+args.autostart+"'></embed>";

		src+='</object>';
		return src;
	}
};

tinyMCEPopup.onInit.add(JWVideoDialog.init, JWVideoDialog);
