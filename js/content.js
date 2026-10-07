/* Holdfast content. Everything a qualified exercise professional needs to review lives in this one file:
   exercises, sets and reps, injury swaps, screening questions, safety notes, routines and written guidance.
   All of it is DRAFT until reviewed. Nothing here gives advice on medication, dose or diagnosis. */
const CONTENT = {
  DAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  FULL: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

  /* Six levels: [sets, reps]. Timed holds use reps x 3 seconds. */
  STAGES: [[2, 8], [2, 10], [2, 12], [3, 8], [3, 10], [3, 12]],
  START: { new: 0, some: 1, regular: 3 },

  /* Kit, best first. Each exercise uses the best kit the member has. */
  ORDER: ['gym', 'dumbbells', 'kettlebell', 'bands', 'none'],
  KIT: {
    none: ['Just my bodyweight', 'A chair and a stair'],
    bands: ['Resistance bands', 'Loop or tube'],
    dumbbells: ['Dumbbells', 'Any weight'],
    kettlebell: ['Kettlebell', 'One is enough'],
    bench: ['Bench or step', 'Sturdy and stable'],
    gym: ['Gym membership', 'Machines and weights']
  },

  /* Exercise library: movement -> kit -> [name, coaching cue, flags]. Flags: h = timed hold, l = weight can be logged. */
  LIB: {
    squat: { gym: ['Leg press', 'Feet hip width. Lower until knees reach 90 degrees.', 'l'], dumbbells: ['Goblet squat', 'One dumbbell at your chest. Sit between your hips.', 'l'], kettlebell: ['Kettlebell goblet squat', 'Hold the bell by the horns at your chest.', 'l'], bands: ['Band squat', 'Stand on the band, handles at shoulders.', ''], none: ['Sit to stand', 'From a chair, no hands. Lower for 3 seconds.', ''] },
    push: { gym: ['Chest press machine', 'Handles level with mid chest. Press without locking out.', 'l'], dumbbells: ['Floor press', 'Lie on the floor. Elbows touch down softly.', 'lf'], kettlebell: ['Kettlebell floor press', 'One arm at a time. Wrist straight.', 'lf'], bands: ['Band chest press', 'Band anchored behind you at chest height.', ''], none: ['Incline press-up', 'Hands on a worktop. Body in one straight line.', ''] },
    pull: { gym: ['Seated row machine', 'Sit tall. Pull elbows past your ribs.', 'l'], dumbbells: ['One-arm row', 'Hand on a chair. Pull to your hip.', 'l'], kettlebell: ['Kettlebell row', 'Hand on a chair. Pull the bell to your hip.', 'l'], bands: ['Band row', 'Anchor at waist height. Elbows brush your ribs.', ''], none: ['Loaded bag row', 'One hand on a chair. Pull a filled bag to your hip.', ''] },
    core: { bands: ['Pallof press', 'Band to your side. Press out and resist the twist.', 'h'], none: ['Dead bug', 'Lower back stays on the floor. Opposite arm and leg.', 'hf'] },
    hinge: { gym: ['Dumbbell Romanian deadlift', 'Soft knees. Weights slide down your thighs.', 'l'], dumbbells: ['Romanian deadlift', 'Soft knees. Dumbbells slide down your thighs.', 'l'], kettlebell: ['Kettlebell deadlift', 'Bell between your feet. Push the floor away.', 'l'], bands: ['Band deadlift', 'Stand on the band. Hinge at the hips, back long.', ''], none: ['Glute bridge', 'Pause for 2 seconds at the top.', 'f'] },
    lunge: { gym: ['Split squat', 'Hold a rail if you need balance.', 'l'], dumbbells: ['Split squat', 'Hold a chair if you need balance.', 'l'], kettlebell: ['Kettlebell step-up', 'Bell at your chest. Push through the whole foot.', 'l'], bands: ['Banded side step', 'Band above knees. Small steps, hips level.', ''], none: ['Step-up', 'Bottom stair. Push through the whole foot.', ''] },
    press: { gym: ['Shoulder press machine', 'Press up without shrugging.', 'l'], dumbbells: ['Overhead press', 'Seated if standing feels wobbly.', 'l'], kettlebell: ['Kettlebell press', 'One arm. Ribs down, squeeze your glutes.', 'l'], bands: ['Band overhead press', 'Stand on the band. Press straight up.', ''], none: ['Bag press overhead', 'Filled bag or two water bottles. Ribs down.', ''] },
    carry: { gym: ['Suitcase carry', 'One heavy dumbbell. Walk tall. Swap sides.', 'hl'], dumbbells: ['Suitcase carry', 'One heavy dumbbell. Walk tall. Swap sides.', 'hl'], kettlebell: ['Kettlebell carry', 'Bell in one hand. Walk tall. Swap sides.', 'hl'], bands: ['Band pull-apart', 'Arms straight, squeeze shoulder blades.', ''], none: ['Suitcase hold', 'Heavy bag in one hand. Stand tall. Swap sides.', 'h'] }
  },
  BENCH_PRESS: ['Dumbbell bench press', 'Feet flat on the floor. Lower to chest height.', 'l'],

  /* Gentler swaps when a member flags something to look after: movement -> list of [area, exercise]. First match wins. */
  ALT: {
    squat: [['knees', ['Sit to stand, high seat', 'Use a higher chair or add a cushion. Slow and steady.', '']]],
    lunge: [['knees', ['Glute bridge march', 'Hips up, lift one foot at a time.', 'f']], ['balance', ['Supported step-back', 'Hold a chair. Step one foot back, bend a little, return.', '']]],
    hinge: [['back', ['Glute bridge', 'Pause for 2 seconds at the top.', 'f']]],
    press: [['shoulders', ['Wall slide', 'Back to the wall. Slide arms up as far as is comfortable.', '']]],
    carry: [['balance', ['Suitcase hold by a worktop', 'One hand on the worktop, weight in the other. Stand tall. Swap sides.', 'h']]]
  },
  /* For members who cannot get down to the floor: any exercise flagged f is replaced with one of these. */
  FLOORFREE: {
    push: ['Wall press-up', 'Hands on a wall at chest height. Lean in, press away.', ''],
    core: ['Seated knee lift', 'Sit tall on a chair. Lift one knee, hold, lower slowly.', 'h'],
    hinge: ['Chair hip hinge', 'Hands on a chair back. Push your hips back, then stand tall.', ''],
    lunge: ['Supported step-back', 'Hold a chair. Step one foot back, bend a little, return.', '']
  },
  CARE: { knees: ['Knees', 'Gentler squats and steps'], back: ['Lower back', 'No loaded bending'], shoulders: ['Shoulders', 'No pressing overhead'], floor: ['Getting down to the floor', 'Everything standing or seated'], balance: ['Balance', 'A chair or worktop to hold'], none: ['Nothing to flag', 'All good'] },

  /* Shown once, before a member's very first session. */
  READY: ['A sturdy chair that will not slide. Put it against a wall if you can.', 'Clear floor space with no loose rugs.', 'Flat shoes or bare feet. No socks on a hard floor.', 'Water within reach.', 'Your phone within reach.', 'You have eaten in the last couple of hours.'],
  BREATHE: 'Breathe out on the effort, in on the way back. Never hold your breath.',
  EFFORT: 'Finish each set feeling you could have done 2 or 3 more. If you could not, that was too much. If you could have done 10 more, add a little next time.',

  /* Health screening. Any "yes" needs GP or prescriber clearance before a plan is built. */
  SCREEN: [
    'Has a doctor said you have a heart condition, or that you should only exercise under medical supervision?',
    'Do you get chest pain, dizziness or fainting when you are active?',
    'Do you have a bone, joint or recent surgery problem that exercise could make worse?',
    'Do you take insulin or another medicine that can cause low blood sugar?',
    'Are you pregnant, or have you given birth in the last 6 months?'
  ],

  /* Conditions a member can tell us about, and the safety notes each one adds to their plan. */
  CONDITIONS: { diabetes: ['Type 2 diabetes', 'Managed with tablets, injections or diet'], bp: ['High blood pressure', 'Treated or monitored'], joints: ['Arthritis or joint pain', 'Knees, hips, hands, anywhere'], none: ['None of these', 'Nothing to add'] },
  SAFETY: {
    diabetes: ['Eat before you train. Do not do a strength session on an empty stomach.', 'If you take insulin or a sulfonylurea, keep a fast-acting sugar such as glucose tablets within reach.', 'Check your feet after longer walks.'],
    bp: ['Breathe out as you lift. Never hold your breath to push through a rep.', 'Get up slowly after floor exercises.'],
    joints: ['A dull ache that fades is normal. Sharp pain is not: stop that exercise.', 'Shorten the range before you skip the movement.']
  },

  GOALS: { muscle: 'keep your muscle', stronger: 'feel stronger day to day', energy: 'have more energy', confidence: 'feel confident exercising' },

  /* "How are you feeling?" Each answer changes what the day offers.
     level: info = carry on, ease = lighter session offered, skip = no strength today, stop = get medical advice. */
  FEEL: [
    { id: 'good', label: 'Good' },
    { id: 'queasy', label: 'Queasy', level: 'ease', title: 'Go gently today', text: 'Feeling sick often eases if you eat little and often and keep sipping fluids. Have something small and plain before you move.', routine: 'settle' },
    { id: 'bunged', label: 'Constipated', level: 'info', title: 'Movement helps', text: 'A daily walk is one of the simplest things you can do for constipation, alongside more water and building up fibre slowly.', routine: 'move' },
    { id: 'tired', label: 'Wiped out', level: 'ease', title: 'Low battery day', text: 'Tiredness is common when you are eating less. Check you have eaten and had a drink, then choose the lighter session or the five-minute lift.', routine: 'lift' },
    { id: 'dizzy', label: 'Dizzy', level: 'skip', title: 'No strength work today', text: 'Sit down, have a drink, and eat something if you have not. If dizziness keeps happening, speak to your GP or prescriber.' },
    { id: 'pain', label: 'Stomach pain', level: 'stop', title: 'Do not train today', text: 'Severe stomach pain that will not settle, or pain that spreads to your back, needs medical advice today. Call 111, or 999 if it is severe.' }
  ],

  /* Guided routines: steps are [instruction, seconds, breathe?]. */
  ROUTINES: {
    move: { group: 'relief', title: 'Get things moving', mins: 5, blurb: 'Gentle movement for a sluggish gut', steps: [['Walk around the house or march on the spot at a comfortable pace.', 90], ['Lie on your back and hug both knees to your chest. Or stay seated and hug one knee at a time.', 45], ['On your back, let both knees fall slowly side to side. Or seated, turn gently to look over each shoulder.', 45], ['Hand on your belly. Breathe in so your hand rises, out so it falls.', 60, 1], ['Stand up slowly and walk again.', 60]] },
    settle: { group: 'relief', title: 'Settle a queasy stomach', mins: 4, blurb: 'Slow breathing and fresh air', steps: [['Sit tall, or stand by an open window. Loosen anything tight at your waist.', 30], ['Breathe in through your nose for 4, out through your mouth for 6.', 120, 1], ['Take a slow stroll. Stay upright, do not lie down.', 90]] },
    lift: { group: 'relief', title: 'Five-minute energy lift', mins: 5, blurb: 'When a full session is too much', steps: [['March on the spot. Swing your arms.', 60], ['Roll your shoulders back, slow and big.', 30], ['Stand up from a chair and sit back down, unhurried.', 60], ['Hands on a wall, lean in and press away.', 60], ['March again, a little quicker.', 60], ['Stand still. Three slow breaths.', 30, 1]] },
    pause: { group: 'mind', title: 'Pause before you eat', mins: 2, blurb: 'Two minutes that change the meal', steps: [['Sit down with your food in front of you. Put your phone face down.', 20], ['Breathe in for 4, out for 6.', 40, 1], ['How hungry are you, from 0 to 10? Just notice the number.', 25], ['Decide your first few bites will be the protein on your plate.', 20], ['Eat slowly. Stop when you are comfortably full.', 15]] },
    crave: { group: 'mind', title: 'Ride out a craving', mins: 3, blurb: 'A craving is a wave, it passes', steps: [['Name it out loud: "I am having a craving for..."', 20], ['Where do you feel it? Mouth, stomach, chest? Stay curious about it.', 30], ['Breathe in for 4, out for 6. Picture the craving as a wave rising.', 60, 1], ['Keep breathing. Waves peak, then fall. You are watching it, not obeying it.', 50, 1], ['Now choose. Eating it is allowed. So is leaving it. Either way, you decided.', 20]] },
    kind: { group: 'mind', title: 'A kinder word with yourself', mins: 3, blurb: 'For the days the mirror is loud', steps: [['Put a hand on your chest. Feel it rise and fall.', 30, 1], ['Name one thing your body did for you today. Carried, climbed, hugged, lifted.', 40], ['Think of what you would say to a friend who is trying as hard as you are.', 40], ['Say that to yourself. Out loud if you can.', 40], ['One slow breath. Carry on with your day.', 20, 1]] },
    wind: { group: 'mind', title: 'Wind down for sleep', mins: 4, blurb: 'Sleep is when muscle rebuilds', steps: [['Dim the lights. Sit or lie comfortably.', 20], ['Tense your feet and legs for 5 seconds, then let go.', 40], ['Tense your hands, arms and shoulders for 5 seconds, then let go.', 40], ['Breathe in for 4, out for 6.', 110, 1], ['Let your breathing go back to normal. Sleep well.', 20]] }
  },

  /* Simple food guidance. Not a diet plan. */
  FOOD: [
    ['When you cannot face food', ['Greek yoghurt, a boiled egg, a glass of milk', 'Soup, a smoothie or a protein shake if solid food is too much', 'A little every 2 to 3 hours beats one big meal']],
    ['Protein first', ['Start each meal with the protein on your plate', 'Aim for 3 palm-sized portions across the day', 'Chicken, fish, eggs, beans, lentils, tofu, cottage cheese']],
    ['Fibre, built up slowly', ['Add one extra portion of fruit, veg, beans or wholegrains a day', 'Go gradually so your gut can adjust', 'More fibre needs more water']],
    ['Fluids', ['Sip through the day instead of big glasses at once', 'Aim for 6 to 8 drinks', 'Fizzy drinks and alcohol can make reflux worse']]
  ],
  FOOD_NOTE: 'This is general guidance, not a diet plan. For a plan built around you, ask your GP for a dietitian referral.',

  LESSONS: [['Why muscle matters when you are losing weight', '3 min'], ['Protein made simple: the palm method', '4 min'], ['The rhythm of your medication week', '3 min'], ['Low appetite days: what to eat first', '4 min'], ['When the scales stall', '3 min'], ['Dose going up? What to expect in your training', '3 min'], ['Coming off the medication and staying strong', '5 min'], ['Keeping the weight off: what the research says', '4 min']],

  INSIGHT: {
    jab: ['Why today is easy', 'Many people find appetite is lowest in the days after their injection. Your hardest sessions sit at the other end of the week on purpose.'],
    easy: ['Rest is part of the plan', 'Muscle repairs on rest days. Protein today matters as much as it does on a training day.'],
    strength: ['Why strength, not just cardio', 'When weight comes off quickly, some of it can be muscle. Asking your muscles to work two or three times a week tells your body to keep them.'],
    walk: ['What walking is for', 'Walking helps your heart, your gut and your mood, and helps keep weight off later. It supports your strength sessions, it does not replace them.']
  },

  /* A short note from the coaching team for each phase. Replace with the real coach's words and video. */
  COACH: {
    Foundations: 'These first weeks are about turning up, not lifting heavy. If you finish thinking "I could have done more", you got it exactly right.',
    Build: 'You have the habit now. This is where we ask a bit more of you. Add a little weight when the last two reps feel easy.',
    Strong: 'Look back at your first strength score. That gap is yours, and nobody gave it to you.',
    'For life': 'The programme does not end, it settles in. Two or three sessions a week, for good, is what keeps the weight off and the strength on.'
  },

  /* Launch settings. Fill these in before going live.
     joinUrl: payment link, shows a Join button on the home page.
     coachEmail: where coach messages and form checks are sent.
     business, contact, payTerms: shown on the Privacy and Terms pages. */
  LAUNCH: {
    joinUrl: '',
    coachEmail: '',
    business: '[your business name and address]',
    contact: '[your contact email]',
    payTerms: '[Price, how often it is charged, how to cancel, and your refund policy. By law, people who buy online usually have 14 days to change their mind.]',
    updated: 'October 2026'
  },

  WINS: ['Stairs felt easier', 'Carried the shopping', 'Clothes fit differently', 'Slept better', 'Trained when I did not feel like it', 'Got up off the floor easily'],
  CIRCLE_PROMPT: 'What felt easier this week than it did a month ago?'
};
if (typeof module !== 'undefined') module.exports = CONTENT;
