class MyDateTime {
	static format = (time, string) => {
		if (['string', 'number'].includes(typeof time)) {
			time = new Date(time);
		}
		if (Object.prototype.toString.call(time) !== '[object Date]' || time == 'Invalid Date') {
			console.warn('Invalid Date: ' + time);
			return 'Invalid Date';
		}
		if (!string) {
			console.warn('Invalid String: ' + string);
			return 'Invalid String';
		}

		let getTime = {
			YYYY: '' + time.getFullYear(),
			YY: ('' + time.getFullYear()).slice(-2),
			MM: ('0' + (time.getMonth() + 1)).slice(-2),
			dd: ('0' + time.getDate()).slice(-2),
			HH: ('0' + time.getHours()).slice(-2),
			mm: ('0' + time.getMinutes()).slice(-2),
			ss: ('0' + time.getSeconds()).slice(-2),
		};
		for (let key in getTime) {
			string = string.replace(key, getTime[key]);
		}
		return string;
	};
}
class MyString {
	static convertViToEn(string) {
		if (string) {
			return string
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.replace(/đ/g, 'd')
				.replace(/Đ/g, 'D');
		}
		return '';
	}
	static search(string, key) {
		key = this.convertViToEn(key);
		string = this.convertViToEn(string);
		let strPatt = '';
		key.split('').forEach((item, index) => {
			strPatt = strPatt + '.{0,2}' + item;
		});
		let regex = new RegExp(strPatt, 'i');

		if (regex.test(string)) {
			return true;
		}
		return false;
	}
}
class MyObject {
	static checkDirectExists(object, direct) {
		let arr = direct.split('.');
		let dir = 'object';
		for (let i = 0; i < arr.length; i++) {
			dir = dir + '.' + arr[i];
			if (eval('!' + dir)) {
				return false;
			}
		}
		return true;
	}
	static hasValueExists(object, value) {
		let find = false;
		let searchObj = (object, value) => {
			if (find) return;
			if (Object.prototype.toString.call(object) == '[object Object]') {
				for (let key in object) {
					searchObj(object[key], value);
				}
			} else if (object == undefined) {
				return;
			} else {
				let string = object.toString();
				if (MyString.search(string, value)) {
					find = true;
				}
			}
		};
		searchObj(object, value);
		return find;
	}
	static getValueByDirect(object, direct) {
		if (typeof direct == 'string') {
			if (MyObject.checkDirectExists(object, direct)) {
				return eval('object.' + direct);
			} else {
				return '';
			}
		} else if (typeof direct == 'function') {
			try {
				return direct(object);
			} catch (e) {
				return '';
			}
		} else console.log('hahahaah');
		return;
	}
	static setValueByDirect(object, direct, value) {
		let strToArr = (str) => {
			//quy định: [5]: array, ["5"]: object
			let arr = str.split(/\[|\]|\./);
			let rs = arr.reduce((acc, item) => {
				if (/^[0-9]+$/.test(item)) item = Number(item);
				if (item !== '') acc.push(item);
				return acc;
			}, []);
			return rs;
		};
		let addProps = (obj, arr, val) => {
			if (arr.length > 1) {
				if (typeof arr[1] == 'string') {
					obj[arr[0]] = obj[arr[0]] || {};
				}
				if (typeof arr[1] == 'number') {
					obj[arr[0]] = obj[arr[0]] || [];
				}
				let temp = obj[arr[0]];
				arr.shift();
				addProps(temp, arr, val);
			} else {
				if (Array.isArray(val)) {
					obj[arr[0]] = (obj[arr[0]] || []).concat(val);
				} else {
					obj[arr[0]] = val;
				}
			}
			return obj;
		};
		if (typeof direct == 'string') direct = strToArr(direct);
		if (Array.isArray(direct)) {
			return addProps(object, direct, value);
		}
	}
	static cleanUndefined(object) {
		object = JSON.parse(JSON.stringify(object));
		if (Array.isArray(object)) {
			let array = object.reduce((acc, item) => {
				if (item) {
					item = MyObject.cleanUndefined(item);
					acc.push(item);
				}
				return acc;
			}, []);
			return array;
		}
		if (Object.prototype.toString.call(object) == '[object Object]') {
			for (let key in object) {
				object[key] = MyObject.cleanUndefined(object[key]);
			}
			return object;
		} else {
			return object;
		}
	}
}
class MyForm {
	static getData(elm) {
		let data = {},
			ipString = elm.querySelectorAll('input[type=text],input[type=password],select'),
			ipNumber = elm.querySelectorAll('input[type=number]'),
			ipDate = elm.querySelectorAll('input[type=date]'),
			ipRadio = elm.querySelectorAll('input[type=radio]'),
			ipCheckbox = elm.querySelectorAll('input[type=checkbox]');
		ipString.forEach((item, index) => {
			if (item.name == '') return;
			MyObject.setValueByDirect(data, item.name, item.value);
		});
		ipNumber.forEach((item, index) => {
			if (item.name == '') return;
			MyObject.setValueByDirect(data, item.name, Number(item.value));
		});
		ipDate.forEach((item, index) => {
			if (item.name == '') return;
			let temp = -27080352000000;
			if (item.value != '') {
				temp = new Date(item.value).getTime();
			}
			MyObject.setValueByDirect(data, item.name, temp);
		});
		ipRadio.forEach((item, index) => {
			if (item.name == '' || item.checked == false) return;
			MyObject.setValueByDirect(data, item.name, item.value);
		});
		ipCheckbox.forEach((item, index) => {
			if (item.name == '' || item.checked == false) return;
			//Rule: name của checkbox ở dạng [] sẽ tạo mảng
			if (item.name.includes('[]')) {
				let n = item.name.replace('[]', '');
				let v = [item.value];
				MyObject.setValueByDirect(data, n, v);
			}
		});
		data = MyObject.cleanUndefined(data);
		return data;
	}
	static setData(object, elm) {
		elm.reset();
		let ipString = elm.querySelectorAll('input[type=text],input[type=password],select'),
			ipNumber = elm.querySelectorAll('input[type=number]'),
			ipDate = elm.querySelectorAll('input[type=date]'),
			ipRadio = elm.querySelectorAll('input[type=radio]'),
			ipCheckbox = elm.querySelectorAll('input[type=checkbox]');

		ipString.forEach((item, index) => {
			if (item.name == '') return;
			item.value = MyObject.getValueByDirect(object, item.name);
		});
		ipNumber.forEach((item, index) => {
			if (item.name == '') return;
			let temp = MyObject.getValueByDirect(object, item.name);
			if (!temp) return;
			if (item.getAttribute('onfocusout') == 'MyForm.typeMoney(this)') {
				item.value = temp.toFixed(3);
			} else {
				item.value = temp;
			}
		});
		ipDate.forEach((item, index) => {
			if (item.name == '') return;
			let temp = MyObject.getValueByDirect(object, item.name);
			if (!temp) return;
			item.value = MyDateTime.format(temp, 'YYYY-MM-dd');
		});
		ipRadio.forEach((item, index) => {
			if (item.name == '') return;
			if (item.value == MyObject.getValueByDirect(object, item.name)) {
				item.checked = true;
			}
		});
		ipCheckbox.forEach((item, index) => {
			if (item.name == '') return;
			//Rule: name của checkbox ở dạng [], cần loại bỏ [] trước
			if (item.name.includes('[]')) {
				let n = item.name.replace('[]', '');
				let val = MyObject.getValueByDirect(object, n);
				if (val.includes(item.value)) {
					item.checked = true;
				}
			}
		});
	}
	static typeMoney(ipNumElement) {
		ipNumElement.value = Number(ipNumElement.value).toFixed(3);
	}
	static disabled(elm, boolean) {
		let length = elm.elements.length;
		for (let i = 0; i < length; i++) {
			elm.elements[i].disabled = boolean;
		}
	}
}
class MyNodeList {
	static groupByAttribute(nodelist, attr) {
		return Object.values(nodelist).reduce((acc, value) => {
			let key = value.getAttribute(attr);
			(acc[key] = acc[key] || []).push(value);
			return acc;
		}, {});
	}
}
class MyFetch {
	static fetch({ url, config, draf, succ, catc, fina }) {
		if (draf && typeof draf === 'function') {
			draf();
			console.log('--- Đợi mạng xử lý !!! ---');
		}
		fetch(url, config)
			.then((response) => response.json())
			.then((resp) => {
				if (succ && typeof succ === 'function') {
					succ(resp);
					//console.log("resp:" + JSON.stringify(resp));
					console.log('--- Bạn đã cập nhật dữ liệu THÀNH CÔNG !!! ---');
				}
			})
			.catch((error) => {
				if (catc && typeof catc === 'function') {
					catc(error);
					console.log('--- Lỗi kết nối mạng. Cập nhật dữ liệu THẤT BẠI. Dữ liệu sẽ được hoàn lại !!! ---');
				}
			})
			.finally(() => {
				if (fina && typeof fina === 'function') {
					fina();
				}
			});
	}
}

class MyTable {
	constructor(object) {
		this.elm = object.elm;
		this.data = object.data;
		this.fetch = object.fetch;
		this.contents = object.contents;
		this.funct = object.funct;
		this.init();
	}
	init() {
		this.id = '#' + this.elm.table.id;
		this.drawDoms();
		this.draws();
		this.firstRun();
		this.updateData();
	}
	fetchData({ url, config, draf, succ, catc, fina }) {
		if (draf && typeof draf === 'function') {
			draf();
			console.log('--- Đợi mạng xử lý !!! ---');
		}
		fetch(url, config)
			.then((response) => response.json())
			.then((resp) => {
				if (succ && typeof succ === 'function') {
					succ(resp);
					//console.log("resp:" + JSON.stringify(resp));
					console.log('--- Bạn đã cập nhật dữ liệu THÀNH CÔNG !!! ---');
				}
			})
			.catch((error) => {
				if (catc && typeof catc === 'function') {
					catc(error);
					console.log('--- Lỗi kết nối mạng. Cập nhật dữ liệu THẤT BẠI. Dữ liệu sẽ được hoàn lại !!! ---');
				}
			})
			.finally(() => {
				if (fina && typeof fina === 'function') {
					fina();
				}
			});
	}
	drawDoms() {
		this.elm.thead = document.querySelectorAll(this.id + '> thead')[0];
		this.elm.tfoot = document.querySelectorAll(this.id + '> tfoot')[0];
		this.elm.tbody = document.querySelectorAll(this.id + '> tbody')[0];
		this.drawStyleNode = () => {
			let tbID = this.elm.table.id;
			let pagID = this.elm.pagination.id;
			let css = `
				table#${tbID} tr.exc,
				table#${tbID} tr.hidden,
				table#${tbID} tr.shade {
					display: none; 
				}
				table#${tbID} > tbody {
					counter-reset: rowNumber;
				}
				table#${tbID} > tbody > tr:not(.detail-row) {
					counter-increment: rowNumber;
				}
				table#${tbID} > tbody > tr:not(.detail-row) > td:first-child::after {
					content: counter(rowNumber);
					min-width: 1em;
					margin-left: 0.5em;
				}
				ul#${pagID} > li.exc {
					display: none; 
				}
				`;
			let style = document.createElement('style'),
				head = document.head || document.getElementsByTagName('head')[0];
			style.appendChild(document.createTextNode(css));
			head.appendChild(style);
		};
		this.drawStyleNode();
		this.actionIndexRow = {
			checkBoxAll: (cbThead, actionList, slAction, btnAction) => {
				let self = this;
				cbThead.onchange = function () {
					if (this.checked == true) {
						let cbList = document.querySelectorAll(
							self.id + '> tbody > tr:not([class*="exc"]):not([style="display: none;"]) input.checkbox-item'
						);
						for (let i = 0; i < cbList.length; i++) {
							cbList[i].checked = true;
						}
						actionList.style.display = '';
					} else {
						let cbAll = document.querySelectorAll(self.id + '> tbody > tr input.checkbox-item');
						for (let i = 0; i < cbAll.length; i++) {
							cbAll[i].checked = false;
						}
						btnAction.style.display = 'none';
						slAction.value = '';
						actionList.style.display = 'none';
					}
				};
			},
			checkBoxItem: (checkbox) => {
				let self = this;
				checkbox.onchange = function () {
					if (this.checked == true) {
						self.elm.actionList.style.display = '';
					} else {
						let cbList = document.querySelectorAll(self.id + '> tbody > tr input.checkbox-item');
						for (let i = 0; i < cbList.length; i++) {
							if (cbList[i].checked == true) return;
						}
						self.elm.actionList.querySelector('button').style.display = 'none';
						self.elm.actionList.querySelector('select').value = '';
						self.elm.actionList.style.display = 'none';
					}
				};
			},
			slAction: (slAction, btnAction) => {
				slAction.onchange = function () {
					if (this.value == '') {
						btnAction.style.display = 'none';
					} else {
						btnAction.style.display = '';
					}
				};
			},
			btnAction: (btnAction, slAction, actionList, cbThead) => {
				let self = this;
				btnAction.onclick = function () {
					let action = slAction.value,
						cbChecked = document.querySelectorAll(self.id + '> tbody > tr > td input.checkbox-item:checked'),
						listID = [];
					for (let i = 0; i < cbChecked.length; i++) {
						let id = cbChecked[i].closest('tr').getAttribute('data-id');
						listID.push(id);
					}
					if (action !== '' && listID.length >= 1) {
						self.eventFetchData(action, listID);
					}
					btnAction.style.display = 'none';
					slAction.value = '';
					actionList.style.display = 'none';
					cbThead.checked = false;
				};
			},
			start: () => {
				if (!this.elm.checkboxThead || !this.elm.actionList) {
					console.warn("This table hasn't Action List service");
					return;
				}
				let cbThead = this.elm.checkboxThead;
				let actionList = this.elm.actionList;
				let slAction = this.elm.actionList.querySelector('select');
				let btnAction = this.elm.actionList.querySelector('button');

				this.actionIndexRow.checkBoxAll(cbThead, actionList, slAction, btnAction);
				this.actionIndexRow.slAction(slAction, btnAction);
				this.actionIndexRow.btnAction(btnAction, slAction, actionList, cbThead);
			},
		};
		this.actionIndexRow.start();
	}
	draws() {
		this.paging = {
			groupTR: MyNodeList.groupByAttribute(
				document.querySelectorAll(this.id + '> tbody > tr:not([class*="exc"])'),
				'data-id'
			),
			selectPage: 1,
			slNumRowsPerPage: 10,
		};
		this.drawSetting = {
			totalLink: () => {
				if (!this.elm.pagination) {
					console.warn('Empty element pagination');
					return;
				}
				let gtr = this.paging.groupTR,
					nr = this.paging.slNumRowsPerPage;
				let pl = Math.ceil(Object.keys(gtr).length / nr);

				let prevLI = `<li class="page-item disabled">
                        	<a class="page-link" href="" tabindex="-1">«</a>
                        </li>`;
				let nextLI = `<li class="page-item">
                        	<a class="page-link" href="">»</a>
                        </li>`;
				let mainLI = ``;
				for (let i = 0; i < pl; i++) {
					mainLI += `<li class="page-item ">
                        	<a class="page-link" href="">${i + 1}</a>
                        </li>`;
				}
				this.elm.pagination.innerHTML = prevLI + mainLI + nextLI;
				this.paging.listLI = this.elm.pagination.querySelectorAll('li');
			},
			activeLink: () => {
				if (!this.paging.listLI) return;
				let lli = this.paging.listLI;
				let n = this.paging.selectPage;
				for (let i = 0; i < lli.length; i++) {
					lli[i].classList.remove('active');
					if (i > 1 && i < lli.length - 2) {
						lli[i].classList.add('exc');
					}
				}
				lli[n].classList.add('active');
				for (let i = n - 2; i <= n + 2; i++) {
					if (lli[i]) {
						lli[i].classList.remove('exc');
					}
				}
			},
			activePage: () => {
				let gtr = this.paging.groupTR,
					slp = this.paging.selectPage,
					nr = this.paging.slNumRowsPerPage;
				Object.keys(gtr).forEach((key, i) => {
					if (i >= (slp - 1) * nr && i <= slp * nr - 1) {
						gtr[key].forEach((item, index) => {
							item.style.display = '';
						});
					} else {
						gtr[key].forEach((item, index) => {
							item.style.display = 'none';
						});
					}
				});
				this.elm.tbody.style.counterReset = 'rowNumber+' + (slp - 1) * nr;
			},
			logicSearch: (string, optS) => {
				this.data.forEach((item, index) => {
					let rows = document.querySelectorAll(this.id + "> tbody > tr[data-id='" + item._id + "']");
					let find = false;
					if (optS == '' || optS == null) {
						find = MyObject.hasValueExists(item, string);
					} else if (optS.includes('.')) {
						let obj = MyObject.getValueByDirect(item, optS);
						find = MyObject.hasValueExists(obj, string);
					} else {
						find = MyObject.hasValueExists(item[optS], string);
					}
					rows.forEach((item, index) => {
						if (find) item.classList.remove('exc');
						else item.classList.add('exc');
					});
				});
				this.reloadLinks(1);
			},
			func: () => {
				if (!this.funct) return;
				for (const key in this.funct) {
					if (Object.hasOwnProperty.call(this.funct, key)) {
						let elms = document.querySelectorAll(key)[0];
						if (typeof this.funct[key] == 'function') {
							this.funct[key](elms);
						}
					}
				}
			},
		};
		this.drawData = {
			mainRow: (mtr, item) => {
				this.drawData.drawIndexRow(mtr, item);
				this.contents.rowMain.forEach((column, i) => {
					let td = document.createElement('td');
					td.innerHTML = MyObject.getValueByDirect(item, column);
					mtr.appendChild(td);
				});
				mtr.setAttribute('data-id', item._id);
			},
			drawIndexRow: (row, item) => {
				let num = document.createElement('td');
				num.classList.add('index-row');
				if (item._temp === true) {
					num.innerHTML = '<i class="fas fa-spinner fa-spin" style="color: red;"></i>';
				} else {
					let input = document.createElement('input');
					input.setAttribute('class', 'checkbox-item');
					input.setAttribute('type', 'checkbox');
					num.appendChild(input);
					console.log();
					this.actionIndexRow.checkBoxItem(input);
				}
				row.appendChild(num);
			},
			detailRow: (dtr, item) => {
				if (!this.contents.rowPlus) return;
				let func = this.contents.rowPlus;
				let td = document.createElement('td');
				td.colSpan = this.contents.rowMain.length;
				td.innerHTML = MyObject.getValueByDirect(item, func);
				dtr.appendChild(td);
				dtr.setAttribute('data-id', item._id);
			},
			addRow: (tbody, item) => {
				if (this.contents.rowPlus) {
					let dtr = document.createElement('tr');
					dtr.classList.add('detail-row', 'hidden');
					this.drawData.detailRow(dtr, item);
					tbody.prepend(dtr);
				}
				let mtr = document.createElement('tr');
				this.drawData.mainRow(mtr, item);
				tbody.prepend(mtr);
			},
			updateRow: (id, newData) => {
				let rows = document.querySelectorAll(this.id + "> tbody > tr[data-id='" + id + "']");
				rows[0].innerHTML = '';
				this.drawData.mainRow(rows[0], newData);
				if (rows[1]) {
					rows[1].innerHTML = '';
					this.drawData.detailRow(rows[1], newData);
				}
			},
			hiddenRow: (id, status) => {
				let rows = document.querySelectorAll(this.id + "> tbody > tr[data-id='" + id + "']");
				rows.forEach((item, index) => {
					if (status == 'shade') item.classList.add('shade');
					if (status == '') item.classList.remove('shade');
				});
			},
			removeRow: (id) => {
				let rows = document.querySelectorAll(this.id + "> tbody > tr[data-id='" + id + "']");
				rows.forEach((item, index) => {
					item.remove();
				});
			},
			allRow: () => {
				this.elm.tbody.innerHTML = '';
				this.data.forEach((item, index) => {
					this.drawData.addRow(this.elm.tbody, item);
				});
			},
		};
		this.event = {
			changeNumRowsDisplay: () => {
				if (!this.elm.slRowsPerPage) return;
				let self = this;
				this.elm.slRowsPerPage.onchange = function () {
					self.paging.slNumRowsPerPage = parseInt(this.value);
					self.paging.selectPage = 1;
					self.drawSetting.totalLink();
					self.drawSetting.activeLink();
					self.drawSetting.activePage();
					self.event.changeLink();
				};
			},
			changeLink: () => {
				if (!this.paging.listLI) return;
				let self = this,
					lli = this.paging.listLI;
				for (let i = 0; i < lli.length; i++) {
					lli[i].onclick = function (e) {
						e.preventDefault();
						switch (this.innerText) {
							case '»':
								if (self.paging.selectPage < lli.length - 2) self.paging.selectPage++;
								break;
							case '«':
								if (self.paging.selectPage > 1) self.paging.selectPage--;
								break;
							default:
								self.paging.selectPage = parseInt(this.innerText);
						}
						self.drawSetting.activeLink();
						self.drawSetting.activePage();
					};
				}
			},
			typeSearch: () => {
				if (!this.elm.slSearch) return;
				let self = this,
					optSearch = '',
					string = '';
				this.elm.slSearch.onchange = function () {
					optSearch = this.value;
					self.drawSetting.logicSearch(string, optSearch);
				};
				this.elm.ipSearch.onkeyup = function () {
					string = this.value.toUpperCase();
					self.drawSetting.logicSearch(string, optSearch);
				};
			},
			toggleDetailRow: (id) => {
				let mainRow = document.querySelectorAll(this.id + `> tbody > tr[data-id='${id}']`)[0],
					detailRow = document.querySelectorAll(this.id + `> tbody > tr[data-id='${id}']`)[1],
					indexCol = mainRow.querySelectorAll(`td.index-row`)[0];
				if (detailRow.classList.contains('hidden')) {
					indexCol.rowSpan = '2';
					detailRow.classList.remove('hidden');
					return true;
				} else {
					indexCol.rowSpan = '1';
					detailRow.classList.add('hidden');
					return false;
				}
			},
		};
		this.reloadLinks = (page) => {
			if (page) {
				this.paging.selectPage = page;
			}
			this.paging.groupTR = MyNodeList.groupByAttribute(
				document.querySelectorAll(this.id + '> tbody > tr:not([class*="exc"])'),
				'data-id'
			);

			this.drawSetting.totalLink();
			this.drawSetting.activeLink();
			this.drawSetting.activePage();
			this.drawSetting.func();
			this.event.changeLink();
		};
		this.reloadNewData = () => {
			this.drawData.allRow();
			this.drawSetting.func();
			this.reloadLinks(1);
		};
	}

	updateData() {
		this.getItemData = (id) => {
			let itemData;
			for (let i = 0; i < this.data.length; i++) {
				if (this.data[i]._id == id) {
					itemData = this.data[i];
					break;
				}
			}
			return itemData;
		};
		this.removeItemData = (id) => {
			for (let i = 0; i < this.data.length; i++) {
				if (this.data[i]._id == id) {
					this.data.splice(i, 1);
					break;
				}
			}
		};
		this.replaceItemData = (id, newItem) => {
			let oldData;
			for (let i = 0; i < this.data.length; i++) {
				if (this.data[i]._id == id) {
					oldData = JSON.parse(JSON.stringify(this.data[i]));
					this.data.splice(i, 1, newItem);
					break;
				}
			}
			return oldData;
		};
	}

	firstRun() {
		if (this.fetch && this.fetch.LIST) {
			this.fetchData({
				url: this.fetch.LIST(),
				succ: (data) => {
					this.data = data;
					if (this.contents.dataSrc && this.contents.dataSrc != '') {
						this.data = MyObject.getValueByDirect(this.data, this.contents.dataSrc);
					}
					firstData();
				},
			});
		} else if (this.data) {
			firstData();
		} else {
			this.data = [];
		}

		let firstData = () => {
			this.reloadNewData();
			this.event.typeSearch();
			this.event.changeNumRowsDisplay();
		};
	}

	eventFetchData(action, id, formData, callback) {
		if (action == 'ADD') {
			let url = this.fetch[action](),
				tempData = JSON.parse(JSON.stringify(formData)),
				id = new Date().getTime();

			tempData._id = id;
			this.fetchData({
				url: url,
				config: {
					method: 'POST',
					body: JSON.stringify(formData),
					headers: {
						'Content-Type': 'application/json',
						//'Content-Type': 'application/x-www-form-urlencoded',
					},
				},
				draf: () => {
					this.data.push(tempData);
					this.drawData.addRow(this.elm.tbody, tempData);
					this.reloadLinks(1);
				},
				succ: (resp) => {
					this.replaceItemData(id, resp);
					this.drawData.updateRow(id, resp);
					if (typeof callback == 'function') {
						callback(resp);
					}
				},
				catc: (error) => {
					console.log(error);
					this.removeItemData(id);
					this.drawData.removeRow(id);
				},
				fina: () => {
					this.reloadLinks(1);
				},
			});
		} else if (action == 'EDIT') {
			let obj = this.getItemData(id),
				form = this.elm.actionForm;
			MyForm.setData(obj, form);
		} else if (action == 'UPDATE' || action == 'REPLACE') {
			let url = this.fetch[action](id),
				tempData = JSON.parse(JSON.stringify(formData)),
				oldData = null;
			tempData._id = id;
			this.fetchData({
				url: url,
				config: {
					method: 'PUT',
					body: JSON.stringify(formData),
					headers: { 'Content-Type': 'application/json' },
				},
				draf: () => {
					oldData = this.replaceItemData(id, tempData);
					this.drawData.updateRow(id, tempData);
				},
				succ: (resp) => {
					console.log(resp);
					if (resp == null) {
						console.error('Error Query !!!, Response is: ' + resp);
						this.replaceItemData(id, oldData);
						this.drawData.updateRow(id, oldData);
					} else {
						this.replaceItemData(id, resp);
						this.drawData.updateRow(id, resp);
					}
				},
				catc: (error) => {
					this.replaceItemData(id, oldData);
					this.drawData.updateRow(id, oldData);
				},
				fina: () => {
					this.reloadLinks();
				},
			});
		} else if (action == 'REMOVE' || action == 'RESTORE' || action == 'DESTROY') {
			let url = this.fetch[action](id),
				method = action == 'DESTROY' ? 'DELETE' : 'PATCH';
			this.fetchData({
				url: url,
				config: { method: method },
				draf: () => {
					this.drawData.hiddenRow(id, 'shade');
					this.reloadLinks();
				},
				succ: (resp) => {
					if (resp == null) {
						console.error('Error Query !!!, Response is: ' + JSON.stringify(resp));
						this.drawData.hiddenRow(id, '');
					} else {
						this.removeItemData(id);
						this.drawData.removeRow(id);
					}
				},
				catc: (error) => {
					this.drawData.hiddenRow(id, '');
				},
				fina: () => {
					this.reloadLinks();
				},
			});
		} else if (action == 'REMOVE-LIST' || action == 'RESTORE-LIST' || action == 'DESTROY-LIST') {
			let url = this.fetch[action](id),
				method = action == 'DESTROY-LIST' ? 'DELETE' : 'PATCH',
				obj = { ids: id };
			this.fetchData({
				url: url,
				config: {
					method: method,
					body: JSON.stringify(obj),
					headers: { 'Content-Type': 'application/json' },
				},
				draf: () => {
					id.forEach((item, index) => {
						this.drawData.hiddenRow(item, 'shade');
					});
					this.reloadLinks();
				},
				succ: (resp) => {
					if (resp.nModified == 0) {
						console.error('Error Query !!!, Response is: ' + JSON.stringify(resp));
					} else {
						id.forEach((item, index) => {
							this.removeItemData(item);
							this.drawData.removeRow(item);
						});
					}
				},
				catc: (error) => {
					id.forEach((item, index) => {
						this.drawData.hiddenRow(item, '');
					});
				},
				fina: () => {
					this.reloadLinks();
				},
			});
		}
	}
}
