export const mentalHealthCategories = [
  {
    id: 'chronic-stress',
    title: 'Chronic Stress and Anxiety',
    description: 'Chronic stress occurs when the body remains in a heightened state of alert for extended periods. This can lead to persistent anxiety, tension headaches, digestive issues, and weakened immune function. These carefully curated audio tracks use calming frequencies and guided techniques to help regulate your nervous system and reduce cortisol levels.',
    color: 'from-blue-50 to-indigo-50',
    tracks: [
      {
        id: 'cs-1',
        title: 'Deep Breathing Meditation',
        duration: '10:30',
        audioUrl: '/audio/breathing.mp3'
      },
      {
        id: 'cs-2',
        title: 'Progressive Muscle Relaxation',
        duration: '15:45',
        audioUrl: '/audio/muscle-relax.mp3'
      },
      {
        id: 'cs-3',
        title: 'Anxiety Release Soundscape',
        duration: '20:00',
        audioUrl: '/audio/anxiety-release.mp3'
      },
      {
        id: 'cs-4',
        title: 'Calm Mind Affirmations',
        duration: '12:15',
        audioUrl: '/audio/affirmations.mp3'
      },
      {
        id: 'cs-5',
        title: 'Stress Relief Binaural Beats',
        duration: '25:00',
        audioUrl: '/audio/binaural.mp3'
      }
    ]
  },
  {
    id: 'sleep-fatigue',
    title: 'Sleep Loss and Fatigue',
    description: 'Insufficient sleep disrupts cognitive function, emotional regulation, and physical recovery. Chronic sleep deprivation can lead to memory problems, mood swings, and increased risk of chronic diseases. These audio sessions promote deep relaxation and healthy sleep patterns through soothing sounds and sleep-inducing frequencies.',
    color: 'from-purple-50 to-pink-50',
    tracks: [
      {
        id: 'sf-1',
        title: 'Nighttime Sleep Meditation',
        duration: '30:00',
        audioUrl: '/audio/sleep-meditation.mp3'
      },
      {
        id: 'sf-2',
        title: 'Deep Sleep Delta Waves',
        duration: '45:00',
        audioUrl: '/audio/delta-waves.mp3'
      },
      {
        id: 'sf-3',
        title: 'Restful Mind Body Scan',
        duration: '18:30',
        audioUrl: '/audio/body-scan.mp3'
      },
      {
        id: 'sf-4',
        title: 'Soothing Rain Soundscape',
        duration: '60:00',
        audioUrl: '/audio/rain.mp3'
      },
      {
        id: 'sf-5',
        title: 'Evening Wind Down Routine',
        duration: '22:00',
        audioUrl: '/audio/wind-down.mp3'
      }
    ]
  },
  {
    id: 'depression-mood',
    title: 'Depression and Mood Disorders',
    description: 'Depression affects neurotransmitter levels, particularly serotonin and dopamine, leading to persistent sadness, loss of interest, and energy depletion. These therapeutic audio tracks combine uplifting frequencies, positive affirmations, and mood-enhancing techniques to support emotional balance and mental wellness.',
    color: 'from-amber-50 to-orange-50',
    tracks: [
      {
        id: 'dm-1',
        title: 'Uplifting Morning Affirmations',
        duration: '14:20',
        audioUrl: '/audio/morning-affirmations.mp3'
      },
      {
        id: 'dm-2',
        title: 'Mood Boost Frequency Therapy',
        duration: '20:00',
        audioUrl: '/audio/frequency-therapy.mp3'
      },
      {
        id: 'dm-3',
        title: 'Self-Compassion Meditation',
        duration: '16:45',
        audioUrl: '/audio/self-compassion.mp3'
      },
      {
        id: 'dm-4',
        title: 'Energy Restoration Session',
        duration: '25:00',
        audioUrl: '/audio/energy-restore.mp3'
      },
      {
        id: 'dm-5',
        title: 'Hope and Healing Journey',
        duration: '19:30',
        audioUrl: '/audio/healing.mp3'
      },
      {
        id: 'dm-6',
        title: 'Gentle Joy Activation',
        duration: '12:00',
        audioUrl: '/audio/joy.mp3'
      }
    ]
  },
  {
    id: 'heart-health',
    title: 'High Blood Pressure and Heart Issues',
    description: 'Chronic stress and poor lifestyle choices can elevate blood pressure, straining the cardiovascular system and increasing risk of heart disease and stroke. These specialized audio programs use heart-coherence techniques and calming rhythms to help lower blood pressure, reduce heart rate, and promote cardiovascular wellness.',
    color: 'from-red-50 to-rose-50',
    tracks: [
      {
        id: 'hh-1',
        title: 'Heart Coherence Breathing',
        duration: '15:00',
        audioUrl: '/audio/heart-coherence.mp3'
      },
      {
        id: 'hh-2',
        title: 'Cardiovascular Calm Down',
        duration: '20:30',
        audioUrl: '/audio/cardio-calm.mp3'
      },
      {
        id: 'hh-3',
        title: 'Blood Pressure Regulation',
        duration: '18:00',
        audioUrl: '/audio/bp-regulation.mp3'
      },
      {
        id: 'hh-4',
        title: 'Heart Health Meditation',
        duration: '22:15',
        audioUrl: '/audio/heart-meditation.mp3'
      }
    ]
  },
  {
    id: 'cognitive-overload',
    title: 'Mental Fatigue and Cognitive Overload',
    description: 'Information overload and constant multitasking exhaust cognitive resources, leading to decreased focus, decision fatigue, and mental burnout. These audio tracks help restore mental clarity through brain-optimizing frequencies, focus-enhancing techniques, and cognitive reset exercises.',
    color: 'from-teal-50 to-cyan-50',
    tracks: [
      {
        id: 'co-1',
        title: 'Mental Clarity Focus Session',
        duration: '15:30',
        audioUrl: '/audio/mental-clarity.mp3'
      },
      {
        id: 'co-2',
        title: 'Brain Reset Meditation',
        duration: '12:00',
        audioUrl: '/audio/brain-reset.mp3'
      },
      {
        id: 'co-3',
        title: 'Cognitive Enhancement Alpha Waves',
        duration: '25:00',
        audioUrl: '/audio/alpha-waves.mp3'
      },
      {
        id: 'co-4',
        title: 'Focus and Concentration Boost',
        duration: '18:45',
        audioUrl: '/audio/focus-boost.mp3'
      },
      {
        id: 'co-5',
        title: 'Mental Energy Renewal',
        duration: '20:00',
        audioUrl: '/audio/mental-energy.mp3'
      }
    ]
  },
  {
    id: 'burnout-exhaustion',
    title: 'Burnout and Emotional Exhaustion',
    description: 'Prolonged workplace or personal stress can lead to burnout—a state of physical, emotional, and mental exhaustion. Symptoms include cynicism, detachment, and reduced performance. These restorative audio experiences help rebuild energy reserves and reconnect with inner peace.',
    color: 'from-emerald-50 to-green-50',
    tracks: [
      {
        id: 'be-1',
        title: 'Burnout Recovery Meditation',
        duration: '20:00',
        audioUrl: '/audio/burnout-recovery.mp3'
      },
      {
        id: 'be-2',
        title: 'Emotional Release Therapy',
        duration: '16:30',
        audioUrl: '/audio/emotional-release.mp3'
      },
      {
        id: 'be-3',
        title: 'Restorative Deep Rest',
        duration: '30:00',
        audioUrl: '/audio/deep-rest.mp3'
      },
      {
        id: 'be-4',
        title: 'Inner Peace Restoration',
        duration: '22:45',
        audioUrl: '/audio/inner-peace.mp3'
      },
      {
        id: 'be-5',
        title: 'Vitality Renewal Session',
        duration: '18:00',
        audioUrl: '/audio/vitality.mp3'
      }
    ]
  }
];