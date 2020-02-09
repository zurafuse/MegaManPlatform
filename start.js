var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.9;

var context = canvas.getContext("2d");

var grid = canvas.width / 30;

const gravity = 12;

var platforms = [];
