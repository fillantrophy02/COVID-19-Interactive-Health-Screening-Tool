function main() {
  templates = templatesGeneration()
  template1()
  for (var id in templates){
    var template = new Function(templates[id])
    template()
  }
}
