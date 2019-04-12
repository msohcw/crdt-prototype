const Document = require('./teletype-crdt/lib/document');
const LocalDocument = require('./teletype-crdt/test/helpers/local-document');

/* @format
 *
 * Message Types
 *
 * ping - request the full state
 * pong - return the full state
 * insert - insert op
 * delete - delete op
 *
 */

INIT = 'init';
OPERATIONS = 'operations';

const channel = new BroadcastChannel('ops');
var latency = 300;

var timeout = 8 * latency;

var siteId = Math.floor(Math.random() * 9999999999);
var initialized = false;

var stateDisplay;
var doc;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function wait_latency() {
  // Here we simulate the latency of a real server-client connection
  await sleep(latency + Math.random() * latency);
}

function initialize() {
  broadcast({
    type: INIT,
    siteId: siteId,
  });
  setTimeout(function() {
    if (!initialized) {
      initialized = true;
      doc = buildDocument(siteId, 'Hello World');
      stateDisplay.innerText = doc.getText();
    }
  }, timeout);
}

function buildDocument(siteId, text) {
  const document = new Document({siteId, text});
  // Do I need this?
  document.localDocument = new LocalDocument(document.getText());
  return document;
}

function updateDisplay() {
  stateDisplay.innerText = doc.getText();
}

function performInsert(pos, text) {
  pos = {row: 0, column: pos};
  op = performSetTextInRange(pos, pos, text);
  updateDisplay();
  return op;
}

function performDelete(pos, text) {
  start = {row: 0, column: pos};
  end = {row: 0, column: pos + 1};
  op = performSetTextInRange(start, end, '');
  updateDisplay();
  return op;
}

function performSetTextInRange(start, end, text, options) {
  return doc.setTextInRange(start, end, text, options);
}

function integrateOperations(operations) {
  if (!initialized) {
    doc = new Document({siteId});
    initialized = true;
  }
  doc.integrateOperations(operations);
  updateDisplay();
}

async function broadcast(msg) {
  console.log('Broadcasting');
  console.log(msg);
  await wait_latency();
  channel.postMessage(msg);
}

async function receive(msg) {
  msg = msg.data;
  await wait_latency();
  console.log('Received');
  console.log(msg);
  switch (msg.type) {
    case INIT:
      broadcast({
        type: OPERATIONS,
        operations: doc.getOperations(),
      });
      break;
    case OPERATIONS:
      integrateOperations(msg.operations);
      break;
    default:
      break;
  }
}

channel.onmessage = receive;

function insertOp(e) {
  insertTextBox = document.getElementById('insert-text');
  insertPosBox = document.getElementById('insert-pos');
  text = insertTextBox.value;
  pos = parseInt(insertPosBox.value);

  msg = {
    type: OPERATIONS,
    operations: performInsert(pos, text),
  };

  broadcast(msg);
}

function deleteOp(e) {
  deletePosBox = document.getElementById('delete-pos');
  pos = parseInt(deletePosBox.value);

  msg = {
    type: OPERATIONS,
    operations: performDelete(pos),
  };

  broadcast(msg);
}

function updateLatency(e) {
  const slider = document.getElementById('latency-slider');
  const displayTime = document.getElementById('time-value');
  latency = parseInt(slider.value);
  displayTime.innerText = slider.value;
}

window.onload = function() {
  document.getElementById('insert-btn').onclick = insertOp;
  document.getElementById('delete-btn').onclick = deleteOp;
  stateDisplay = document.getElementById('state-display');
  document.getElementById('latency-slider').onchange = updateLatency;

  initialize();
};
