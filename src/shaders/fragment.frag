precision highp float;

#define MAX_RAY_DIST 100.
#define MAX_RAY_STEPS 500.
#define MIN_HIT_THRESHOLD 0.01

uniform float u_time;
varying vec3 v_color;
varying vec2 v_uv;

struct Result
{
    float distance;
    vec3 color;
};

Result get_min_distance(in vec3 p){
    // float min_distance_sphere = distance(p, vec3(sin(iTime), 0, 2 + cos(iTime))) - 0.4;

    float min_distance_sphere = distance(p, vec3(sin(u_time)/2., 1. + sin(u_time*3.3)*0.5, 1.5 + sin(u_time)/3.)) - 0.3;

    float min_distance_floor = p.y+0.6;

    if (min_distance_sphere < min_distance_floor){
        return Result(min_distance_sphere, vec3(0, 0.6, 0));
    } else{
        return Result(min_distance_floor, vec3(0.6, 0, 0.6));
    }
}


vec3 get_normal(vec3 p){
    const vec2 small_step = vec2(0.01, 0.);

    float dist = get_min_distance(p).distance;

    vec3 n = dist -vec3(get_min_distance(p - small_step.xyy).distance,
                        get_min_distance(p - small_step.yxy).distance,
                        get_min_distance(p - small_step.yyx).distance);

    return normalize(n);
}

Result raymarch(in vec3 origin, in vec3 dir){
    float dist_travelled = 0.;
    for (float i = 0.; i < MAX_RAY_STEPS; i++){
        vec3 p = origin + dir * dist_travelled;
        Result r = get_min_distance(p);
        dist_travelled += r.distance;
        if (r.distance < MIN_HIT_THRESHOLD){
            return Result(dist_travelled, r.color);
        }
        if (dist_travelled > MAX_RAY_DIST){
            return Result(dist_travelled, vec3(0, 0, 0));
        }


    }
    return Result(dist_travelled, vec3(0, 0, 0));
}

float get_brightness(vec3 p, vec3 normal, vec3 light){
    vec3 light_dif = light - p;
    vec3 light_dir = normalize(light_dif);

    float light_dist = distance(p, light);
    float dot_product = dot(normal, light_dir);
    float brightness = clamp(dot_product, 0., 1.);

    float dist = raymarch(p + light_dir * MIN_HIT_THRESHOLD * 10., light_dir).distance;
//    brightness = 0.2+0.8*smoothstep(0.49, 0.51, brightness);

    if (dist < light_dist){
        brightness *= 0.2;
    }


    return brightness;
}

void main() {
      // Set origin to center of the screen
    vec2 uv = v_uv*2.-vec2(1,1) * 0.5;
    // Fix aspect ratio
    // uv.x *= iResolution.x / iResolution.y;



    vec3 camera = vec3(0, 0, -2);
    vec3 direction = normalize(vec3(uv, 2));
//    vec3 light = vec3(6 * sin(iTime + 2) + 8, 10 + sin(iTime + 3), -6 + 6 * sin(iTime+1));
    vec3 light = vec3(6 , 10, -6 );


    Result r = raymarch(camera, direction);
    float dist = r.distance;
    vec3 hit_point = camera + direction * dist;
    vec3 normal = get_normal(hit_point);

    float brightness = get_brightness(hit_point, normal, light);

    gl_FragColor = vec4(vec3(brightness*r.color), 1);
//   gl_FragColor = vec4(v_color, 1);
}