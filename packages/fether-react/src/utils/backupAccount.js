import FileSaver from 'file-saver';
import parityStore from '../stores/parityStore';

export default (address, password) =>
  parityStore.api.parity.exportAccount(address, password).then(res => {
    const blob = new window.Blob([JSON.stringify(res)], {
      type: 'application/json; charset=utf-8'
    });

    FileSaver.saveAs(blob, `${res.address}.json`);
  });
