require './vtables.rb'
require 'json'

desc 'Generate JS from ruby state definitions'
task :gen do

  File.open('./lib/transitions.js', 'w') do |file|

    file.puts '"use strict;"'
    file.puts
    file.puts 'module.exports = {'

    VT100::Parser::STATES.each do |state, table|
      file.write "\t" + state.to_json
      file.write ": {\n"

      table.each do |triggers, actions|
        js_actions = [nil,nil]

        case actions
        when Array
          js_actions[0] = actions[0].to_s       if actions[0]
          js_actions[1] = actions[1].state.to_s if actions[1]
        when VT100::Parser::Transition
          js_actions[1] = actions.state.to_s
        when Symbol
          js_actions[0] = actions.to_s
        end

        case triggers
        when Range
          triggers.each do |val|
            file.write("\t\t#{val.to_i}:\t#{js_actions.to_json},\n")
          end
        when Symbol
          case triggers
          when :on_entry
            file.write("\t\tentry:\t#{js_actions[0].to_json},\n")
          when :on_exit
            file.write("\t\texit:\t#{js_actions[0].to_json},\n")
          end
        when Integer
            file.write("\t\t#{triggers.to_i}:\t#{js_actions.to_json},\n")
        end
      end

      file.write "\t},\n"
    end
    file.puts '};'
  end

  puts '-' * 80
  puts `cat ./lib/transitions.js`
end

task :html do
  sh 'haml ./html/player.haml ./html/player.html'
end

task :css do
  sh 'sass ./css/sgr.sass ./css/sgr.css'
  sh 'sass ./css/player.sass ./css/player.css'
end

task :static do
  Rake::Task["html"].invoke
  Rake::Task["css"].invoke
end

task :default => :gen
