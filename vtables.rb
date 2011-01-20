module VT100
  module Parser

    class Transition
      attr_accessor :state

      def self.to(state)
        new(state)
      end

      def initialize state
        @state = state
      end
    end


    ANYWHERE_TRANSITIONS = {
      0x18       => [:execute, Transition.to(:GROUND)],
      0x1a       => [:execute, Transition.to(:GROUND)],
      0x80..0x8f => [:execute, Transition.to(:GROUND)],
      0x91..0x97 => [:execute, Transition.to(:GROUND)],
      0x99       => [:execute, Transition.to(:GROUND)],
      0x9a       => [:execute, Transition.to(:GROUND)],
      0x9c       => Transition.to(:GROUND),
      0x1b       => Transition.to(:ESCAPE),
      0x98       => Transition.to(:SOS_PM_APC_STRING),
      0x9e       => Transition.to(:SOS_PM_APC_STRING),
      0x9f       => Transition.to(:SOS_PM_APC_STRING),
      0x90       => Transition.to(:DCS_ENTRY),
      0x9d       => Transition.to(:OSC_STRING),
      0x9b       => Transition.to(:CSI_ENTRY),
    }

    STATES = {

      :GROUND => {
        0x00..0x17 => :execute,
        0x19       => :execute,
        0x1c..0x1f => :execute,
        0x20..0x7f => :print,
      },

      :ESCAPE => {
        :on_entry  => :clear,
        0x00..0x17 => :execute,
        0x19       => :execute,
        0x1c..0x1f => :execute,
        0x7f       => :ignore,
        0x20..0x2f => [:collect, Transition.to(:ESCAPE_INTERMEDIATE)],
        0x30..0x4f => [:esc_dispatch, Transition.to(:GROUND)],
        0x51..0x57 => [:esc_dispatch, Transition.to(:GROUND)],
        0x59       => [:esc_dispatch, Transition.to(:GROUND)],
        0x5a       => [:esc_dispatch, Transition.to(:GROUND)],
        0x5c       => [:esc_dispatch, Transition.to(:GROUND)],
        0x60..0x7e => [:esc_dispatch, Transition.to(:GROUND)],
        0x5b       => Transition.to(:CSI_ENTRY),
        0x5d       => Transition.to(:OSC_STRING),
        0x50       => Transition.to(:DCS_ENTRY),
        0x58       => Transition.to(:SOS_PM_APC_STRING),
        0x5e       => Transition.to(:SOS_PM_APC_STRING),
        0x5f       => Transition.to(:SOS_PM_APC_STRING),
      },

      :ESCAPE_INTERMEDIATE => {
        0x00..0x17 => :execute,
        0x19       => :execute,
        0x1c..0x1f => :execute,
        0x20..0x2f => :collect,
        0x7f       => :ignore,
        0x30..0x7e => [:esc_dispatch, Transition.to(:GROUND)]
      },

      :CSI_ENTRY => {
        :on_entry  => :clear,
        0x00..0x17 => :execute,
        0x19       => :execute,
        0x1c..0x1f => :execute,
        0x7f       => :ignore,
        0x20..0x2f => [:collect, Transition.to(:CSI_INTERMEDIATE)],
        0x3a       => Transition.to(:CSI_IGNORE),
        0x30..0x39 => [:param, Transition.to(:CSI_PARAM)],
        0x3b       => [:param, Transition.to(:CSI_PARAM)],
        0x3c..0x3f => [:collect, Transition.to(:CSI_PARAM)],
        0x40..0x7e => [:csi_dispatch, Transition.to(:GROUND)]
      },

      :CSI_IGNORE => {
        0x00..0x17 => :execute,
        0x19       => :execute,
        0x1c..0x1f => :execute,
        0x20..0x3f => :ignore,
        0x7f       => :ignore,
        0x40..0x7e => Transition.to(:GROUND),
      },

      :CSI_PARAM => {
        0x00..0x17 => :execute,
        0x19       => :execute,
        0x1c..0x1f => :execute,
        0x30..0x39 => :param,
        0x3b       => :param,
        0x7f       => :ignore,
        0x3a       => Transition.to(:CSI_IGNORE),
        0x3c..0x3f => Transition.to(:CSI_IGNORE),
        0x20..0x2f => [:collect, Transition.to(:CSI_INTERMEDIATE)],
        0x40..0x7e => [:csi_dispatch, Transition.to(:GROUND)]
      },

      :CSI_INTERMEDIATE => {
        0x00..0x17 => :execute,
        0x19       => :execute,
        0x1c..0x1f => :execute,
        0x20..0x2f => :collect,
        0x7f       => :ignore,
        0x30..0x3f => Transition.to(:CSI_IGNORE),
        0x40..0x7e => [:csi_dispatch, Transition.to(:GROUND)],
      },

      :DCS_ENTRY => {
        :on_entry  => :clear,
        0x00..0x17 => :ignore,
        0x19       => :ignore,
        0x1c..0x1f => :ignore,
        0x7f       => :ignore,
        0x3a       => Transition.to(:DCS_IGNORE),
        0x20..0x2f => [:collect, Transition.to(:DCS_INTERMEDIATE)],
        0x30..0x39 => [:param, Transition.to(:DCS_PARAM)],
        0x3b       => [:param, Transition.to(:DCS_PARAM)],
        0x3c..0x3f => [:collect, Transition.to(:DCS_PARAM)],
        0x40..0x7e => Transition.to(:DCS_PASSTHROUGH)
      },

      :DCS_INTERMEDIATE => {
        0x00..0x17 => :ignore,
        0x19       => :ignore,
        0x1c..0x1f => :ignore,
        0x20..0x2f => :collect,
        0x7f       => :ignore,
        0x30..0x3f => Transition.to(:DCS_IGNORE),
        0x40..0x7e => Transition.to(:DCS_PASSTHROUGH)
      },

      :DCS_IGNORE => {
        0x00..0x17 => :ignore,
        0x19       => :ignore,
        0x1c..0x1f => :ignore,
        0x20..0x7f => :ignore,
      },

      :DCS_PARAM => {
          0x00..0x17 => :ignore,
          0x19       => :ignore,
          0x1c..0x1f => :ignore,
          0x30..0x39 => :param,
          0x3b       => :param,
          0x7f       => :ignore,
          0x3a       => Transition.to(:DCS_IGNORE),
          0x3c..0x3f => Transition.to(:DCS_IGNORE),
          0x20..0x2f => [:collect, Transition.to(:DCS_INTERMEDIATE)],
          0x40..0x7e => Transition.to(:DCS_PASSTHROUGH)
      },

      :DCS_PASSTHROUGH => {
        :on_entry  => :hook,
        0x00..0x17 => :put,
        0x19       => :put,
        0x1c..0x1f => :put,
        0x20..0x7e => :put,
        0x7f       => :ignore,
        :on_exit   => :unhook
      },

      :SOS_PM_APC_STRING => {
        0x00..0x17 => :ignore,
        0x19       => :ignore,
        0x1c..0x1f => :ignore,
        0x20..0x7f => :ignore,
      },

      :OSC_STRING => {
        :on_entry  => :osc_start,
        0x00..0x17 => :ignore,
        0x19       => :ignore,
        0x1c..0x1f => :ignore,
        0x20..0x7f => :osc_put,
        :on_exit   => :osc_end
      }
    }

  end
end
