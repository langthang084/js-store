$('form').submit(function(e){
	e.preventDefault()
	var serialize = $(this).serialize();
	var obj = JSON.parse('{"' + decodeURI(serialize).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
	var email = decodeURIComponent(obj["email"]);
	var packageArr,userArray;
	var database = firebase.database();
	var flag = false;
	database.ref('packages').on('value',function(snapshot){
		packs = snapshot.val();
	})
	database.ref('users').once('value').then(function(snapshot){
		var data = snapshot.val();
		userArray = Object.values(data);
		for(var i = 0,len = userArray.length;i<len;i++){
			var user = userArray[i];
			if(user.email == email && user.status == "0"){
				var now = new Date();
				if(packs.hasOwnProperty(user.selectedPack)){
					var pack = packs[user.selectedPack];
					var packDay = new Date(moment(new Date(moment().format())).add(pack.days,'days')).getTime()
					var packDownloadTime = pack.downloadTime;
					database.ref('users/' + user.fullName + '/status').set(1);
					database.ref('users/' + user.fullName + '/expired').set(packDay);
					database.ref('users/' + user.fullName + '/downloadTime').set(packDownloadTime);
					alert("Set thành công")
				}
				break;
			}else{
				flag = true;
			}
		}
		if(flag){
				alert("Tài khoản đã được set hoặc không tồn tại")
		}
	})
})
