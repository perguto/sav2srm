// Convert between Mesen sav files and MGBA srm files
// Flip bytes in groups of 8
const GROUP_SIZE = 8

if(Deno.args.length != 1){
	console.error(
`Please provide exactly one file path as an argument.
The provided arguments are: 
${ Deno.args.map((v,i)=>`${i}: ${v}`).join('\n') }`)
	Deno.exit(1)
}
let path = Deno.args[0]
let dot_pos = path.lastIndexOf('.')
if(dot_pos < 0){
	console.error(`File ${path} has no ending`)
	Deno.exit(1)
}
let filetype = path.slice(dot_pos + 1)
if(filetype != 'sav' && filetype != 'srm'){
	console.error(`Filetype ${filetype} not supported. Filetype has to be either sav or srm.`)
	Deno.exit(1)
}

let output_filetype = (filetype == 'sav') ? 'srm' : 'sav'
let output_path = path.slice(0, dot_pos + 1) + output_filetype


let file = Deno.readFileSync(path)
let l = file.length
if(l % GROUP_SIZE != 0){
	console.error(`File ${path} has size ${l}, which is not divisible by ${GROUP_SIZE}.`)
	Deno.exit(1)
}
for(let i = 0; i < l; i++){
	// let offset = 8 * l
	// let group = file.slice(offset, offset + 8)
	// let reversed = group.reverse()
	// file.set(reversed, offset)
	for(let k = 0; k < GROUP_SIZE/2; k++){
		let a = GROUP_SIZE * i + k
		let b = GROUP_SIZE * i + GROUP_SIZE - 1 - k
		let temp = file[a]
		file[a] = file[b]
		file[b] = temp
	}
}


let options : Deno.WriteFileOptions  = 
	{
		createNew: true // set to false to allow overwriting of existing files
	}
Deno.writeFileSync(output_path, file, options)

