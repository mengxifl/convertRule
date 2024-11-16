
import { allPropertyName } from './replaceConfig.js'
import ExcelJS from 'exceljs';


const convertFileContent = ( file, processFunc ) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const fileContent = e.target.result;
    const getConvertData = convertMain( fileContent )
    processFunc( getConvertData )
  };
  reader.readAsText(file);
}


const convertMain = ( fileContent ) => {
  let combineEntry = ""

  let headAndTail  = getHeadAndTail( fileContent )
  let tableRuleEntry = []
  let falidRuleEntry = []

  const allEntry   = getAllEntry( fileContent )

  for ( let j = allEntry.length - 1; j >= 0; j--) {
    const  reableRule = buildHumanReadable( extractName( allEntry[j] ) )
    if ( reableRule.result !== `failed`) { tableRuleEntry.push(  reableRule )  }
    if ( reableRule.result === `failed`) {
      falidRuleEntry.push(  reableRule )
      headAndTail.header = deleteTailId( headAndTail.header, allEntry[j] )
      continue
    }
    combineEntry = combineEntry + convertEveryEntry( allEntry[j] ) + `\n`
  }
  const webTableData = tableRuleEntry.concat(falidRuleEntry)
  return {
    table: webTableData,
    convertFile: headAndTail.header + combineEntry + headAndTail.tail,
    report: buildExcelHook( webTableData )
  }
}

const convertEveryEntry = ( content ) => {
  for( let index in allPropertyName ) {
    if( !allPropertyName[index].allowImport ) {
      content = replace( content, index )
    }
  }
  return content
}

const buildHumanReadable = ( googleRule ) => {
  let humanReadableGoogle = { rule: {}, action: {} }
  let humanReadableFeishu = { rule: {}, action: {} }
  let differentReadable   = { rule: {}, action: {} }
  let convertStatus       = "success"
  let suggestion          = "none"
  for ( let j =  googleRule.length - 1; j >= 0; j-- ) {
    humanReadableGoogle = buildRuleAndValue( googleRule[ j ], humanReadableGoogle, `google` )
    humanReadableFeishu = buildRuleAndValue( googleRule[ j ], humanReadableFeishu, `feishu` )
  }

  if( humanReadableGoogle[`rule`][`size`] === undefined ) {
    delete humanReadableGoogle[`rule`]['sizeOperator']
    delete humanReadableGoogle[`rule`]['sizeUnit']
  }

  differentReadable[`rule`] = getBiggerMapDifferentThanSmailMap(
    humanReadableGoogle[`rule`],
    humanReadableFeishu[`rule`]
  )
  differentReadable[`action`] = getBiggerMapDifferentThanSmailMap(
    humanReadableGoogle[`action`],
    humanReadableFeishu[`action`]
  )

  if( Object.keys( differentReadable[`action`] ).length !== 0 ) {
    suggestion    = buildSuggestion( differentReadable, `Edit this rule after import:`, "extend" )
    convertStatus = "some success"
  }
  if( Object.keys( differentReadable[`rule`] ).length  !== 0  ) {
    suggestion    = buildSuggestion( differentReadable, `Edit this rule after import:`, "extend" )
    // buildSuggestion( differentReadable )
    convertStatus = "some success"
  }

  if( Object.keys( humanReadableFeishu[`action`] ).length === 0 ) {
    suggestion    = buildSuggestion( humanReadableGoogle, `Create a rule:`, "create" )
    // buildSuggestion( humanReadableGoogle )
    convertStatus = "failds"
  }
  if( Object.keys( humanReadableFeishu[`rule`] ).length  === 0  ) {
    suggestion    = buildSuggestion( humanReadableGoogle, `Create a rule:`, "create" )
    // buildSuggestion( humanReadableGoogle )
    convertStatus = "failds"
  }

  return {
    googleRule: buildRule( humanReadableGoogle ),
    feishuRule: buildRule( humanReadableFeishu ),
    different:  buildRule( differentReadable ),
    result:     convertStatus ,
    suggestion: suggestion
  }
}


const buildExcelHook =  ( allRulesMap ) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('convert report' );
  worksheet.addRow( [`google mail rule`, 'feishu mail rule', 'some rule can not convert', 'result', 'suggest' ] )
  for (let j = 0; j < allRulesMap.length; j++) {
    const everyRule = allRulesMap[j]
    worksheet.addRow( buildExcelRow( everyRule ) )
  }
  worksheet.columns.forEach(column => {
    column.eachCell({ includeEmpty: true }, cell => {
      const cellValue = cell.value ? cell.value.toString() : ''
      cell.alignment = { wrapText: true, horizontal: 'top', vertical: 'middle',  };
    })
    column.width = 30;
  })
  return workbook
}


const buildExcelRow = ( ruleRow ) => {
  let reportRow = []
  for( let index in ruleRow ) {
    reportRow.push( ruleRow[index].replace(/<br>/g, '\n') )
  }
  return reportRow
}


const buildRule = ( ruleList ) => {
  return buildJsonData( ruleList[`rule`], "rule:<br>", "" )
    + `<br> mail <br><br>`
    + buildJsonData( ruleList[`action`], "action:<br>", " mail " )
}


const buildJsonData = ( ruleList, combinePerfix, suffixFix ) => {
  let combineString = ``
  for( let index in ruleList ) {
    combineString = combineString + ruleList[index]  + `<br>`
  }

  if (combineString !== '') {
    return combinePerfix  + combineString.slice(0, -4)
  }
  if (combineString === '') {
    return combinePerfix + `none`
  }
}



const getBiggerMapDifferentThanSmailMap = ( bigMap, smailMap ) => {
  let diferent = {}
  for( let index in bigMap ) {
    // console.dir( smailMap[index] )
    if(smailMap[index] === undefined) {
      diferent[index] = bigMap[index]
    }
  }
  return diferent
  // console.dir( diferent )
}



const buildRuleAndValue = ( oneProperty, ruleAndOperate, system ) => {
  let   value           = oneProperty[2]
  const fullOfProperty  = oneProperty[0]
  const index           = oneProperty[1]

  const humanReadable   = allPropertyName[index].ruleNameReable
  const actionType      = allPropertyName[index].actionType
  const allowImport     = allPropertyName[index].allowImport
  const valueType       = allPropertyName[index].valueType
  // console.dir( value )
  if( system === `feishu` && !allowImport ) { return ruleAndOperate }
  if ( valueType === "bool" )   { value = humanReadable }
  if ( valueType === "map" )    { value = humanReadable + allPropertyName[index].mapValue[value] }
  if ( valueType === "string" ) { value = humanReadable + `[` + value + `]` }
  if ( valueType === "int" )    { value = humanReadable + value }
  ruleAndOperate[ actionType ][ index ] = value
  return ruleAndOperate
}


const buildSuggestion = ( ruleList, suggestPerfix, opertionPerfix ) => {
  let suggest = ""
  const rule = buildJsonData( ruleList[`rule`], "" )
  const action =  buildJsonData( ruleList[`action`], "" )
  if( rule !== `none` ) {
    suggest = suggest + opertionPerfix + `rule:<br>` + rule + ` `
  }
  if( action !== `none`) {
    suggest = suggest + `<br><br>` + opertionPerfix + `action:<br>` + action + ` `
  }
  if(suggest === "") { return `none` }
  if( suggest.slice(-1) === ' ' )  { return  suggestPerfix + `<br>` + suggest.slice(0, -1) }
  return suggestPerfix + `<br>` + suggest
}



const replace = ( fileContent, clearPropertyName) => {
  const regex = new RegExp(`<apps:property\\s+name='${clearPropertyName}'[^>]*>`, 'g');
  // console.dir( clearPropertyName )
  let tempFileContent = fileContent.replace(regex, '')
  return tempFileContent.replace(/^\s*[\r\n]/gm, '')
}


const getAllEntry = ( content ) => {
  const entry = new Set();
  const regex = /<entry>.*?<\/entry>/gs
  return content.match(regex)
}


const extractName = ( content ) => {
  const names = new Set();
  const regex = /<apps:property\s+name='([^']*)'.+value='([^']*)'\/>/g
  let   match
  while ((match = regex.exec(content)) !== null) {
    names.add(match)
  }
  return Array.from(names)
}

const getHeadAndTail = ( content ) => {
  const headRegex = /([\s\S]*?)<entry>/
  const tailRegex = /<\/entry>(?![\s\S]*<\/entry>)([\s\S]*)/
  return {header: content.match(headRegex)[1], tail: content.match(tailRegex)[1]}
}


const deleteTailId = ( header, rule ) => {
  const clearStringId = rule.match(/<id>[\s\S]+filter:([\s\S]+)<\/id>/)[1]
  header = header.replace(clearStringId, "")
  header = header.replace(`,,`, ",")
  header = header.replace(`:,`, ":")
  header = header.replace(`,<`, "<")
  return header
}






export {
  convertFileContent,
  convertMain,
}